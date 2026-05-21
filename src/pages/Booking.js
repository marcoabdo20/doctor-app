import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useBooking } from '../hooks/useBooking';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import {
  Container,
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Fade,
  Card,
  CardContent
} from '@mui/material';
import { CalendarMonth, AccessTime, Person, CheckCircle, ArrowForward, ArrowBack } from '@mui/icons-material';

export default function Booking() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { t, language } = useLanguage();
  const { bookAppointment, loading: bookingLoading, error: bookingError } = useBooking();

  const [activeStep, setActiveStep] = useState(0);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const steps = language === 'ar' 
    ? ['اختر التاريخ', 'اختر الوقت', 'تأكيد الحجز']
    : ['Select Date', 'Select Time', 'Confirm Booking'];

  function getDayName(dateString) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const date = new Date(dateString);
    return days[date.getDay()];
  }

  function getNext7Days() {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { 
          weekday: 'long', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    return days;
  }

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const docRef = doc(db, 'doctors', doctorId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDoctor({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctor();
  }, [doctorId]);

  useEffect(() => {
    if (selectedDate && doctor) {
      const dayName = getDayName(selectedDate);
      const times = doctor.availability?.[dayName] || [];
      setAvailableTimes(times);
      setSelectedTime('');
    }
  }, [selectedDate, doctor]);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleBooking = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const result = await bookAppointment({
      patientId: currentUser.uid,
      patientName: currentUser.displayName,
      patientEmail: currentUser.email,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      date: selectedDate,
      time: selectedTime,
      price: doctor.price,
      notes: notes,
      status: 'pending'
    });

    if (result.success) {
      setBookingSuccess(true);
      handleNext();
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!doctor) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{language === 'ar' ? 'الطبيب غير موجود' : 'Doctor not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Fade in timeout={500}>
        <Box>
          <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 700 }}>
            {t('bookAppointment')}
          </Typography>

          <Typography variant="h6" align="center" color="primary" gutterBottom>
            {doctor.name} - {language === 'ar' ? doctor.specialty : doctor.specialty}
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4, direction: language === 'ar' ? 'rtl' : 'ltr' }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
            {/* Step 1: Select Date */}
            {activeStep === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarMonth color="primary" />
                  {t('selectDate')}
                </Typography>

                <Grid container spacing={2}>
                  {getNext7Days().map((day) => (
                    <Grid item xs={6} sm={4} md={3} key={day.value}>
                      <Chip
                        label={day.label}
                        onClick={() => setSelectedDate(day.value)}
                        color={selectedDate === day.value ? 'primary' : 'default'}
                        sx={{ 
                          width: '100%', 
                          py: 2,
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          '&:hover': { bgcolor: 'primary.light', color: 'white' }
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Step 2: Select Time */}
            {activeStep === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime color="primary" />
                  {t('selectTime')} - {selectedDate}
                </Typography>

                {availableTimes.length > 0 ? (
                  <Grid container spacing={2}>
                    {availableTimes.map((time) => (
                      <Grid item xs={4} sm={3} md={2} key={time}>
                        <Chip
                          label={time}
                          onClick={() => setSelectedTime(time)}
                          color={selectedTime === time ? 'primary' : 'default'}
                          sx={{ 
                            width: '100%', 
                            py: 1.5,
                            cursor: 'pointer',
                            fontSize: '1rem'
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Alert severity="warning">
                    {language === 'ar' 
                      ? 'لا توجد مواعيد متاحة لهذا التاريخ. اختر تاريخاً آخر.'
                      : 'No available times for this date. Please select another date.'
                    }
                  </Alert>
                )}

                <TextField
                  label={language === 'ar' ? 'ملاحظات إضافية (اختياري)' : 'Additional Notes (Optional)'}
                  multiline
                  rows={3}
                  fullWidth
                  sx={{ mt: 3 }}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Box>
            )}

            {/* Step 3: Confirm */}
            {activeStep === 2 && !bookingSuccess && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person color="primary" />
                  {language === 'ar' ? 'تأكيد الحجز' : 'Confirm Your Booking'}
                </Typography>

                <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography color="text.secondary">{t('doctorName')}</Typography>
                        <Typography variant="h6">{doctor.name}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography color="text.secondary">{t('specialty')}</Typography>
                        <Typography variant="h6">{doctor.specialty}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography color="text.secondary">{t('date')}</Typography>
                        <Typography variant="h6">{selectedDate}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography color="text.secondary">{t('time')}</Typography>
                        <Typography variant="h6">{selectedTime}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography color="text.secondary">{t('price')}</Typography>
                        <Typography variant="h5" color="success.main" sx={{ fontWeight: 700 }}>
                          {doctor.price} {language === 'ar' ? 'جنيه' : 'EGP'}
                        </Typography>
                      </Grid>
                      {notes && (
                        <Grid item xs={12}>
                          <Typography color="text.secondary">{language === 'ar' ? 'ملاحظات' : 'Notes'}</Typography>
                          <Typography>{notes}</Typography>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>

                {bookingError && (
                  <Alert severity="error" sx={{ mb: 2 }}>{bookingError}</Alert>
                )}
              </Box>
            )}

            {/* Success Message */}
            {activeStep === 3 && bookingSuccess && (
              <Box textAlign="center" py={4}>
                <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                <Typography variant="h4" gutterBottom color="success.main" sx={{ fontWeight: 700 }}>
                  {t('bookingSuccess')}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {language === 'ar' 
                    ? `موعدك مع د. ${doctor.name} في انتظار التأكيد`
                    : `Your appointment with Dr. ${doctor.name} is pending confirmation`
                  }
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {t('date')}: {selectedDate} {t('time')}: {selectedTime}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ mt: 3, borderRadius: 2 }}
                  onClick={() => navigate('/appointments')}
                >
                  {t('myAppointments')}
                </Button>
              </Box>
            )}

            {/* Navigation Buttons */}
            {activeStep < 3 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={<ArrowBack />}
                  variant="outlined"
                >
                  {t('back')}
                </Button>

                {activeStep === 2 ? (
                  <Button
                    variant="contained"
                    onClick={handleBooking}
                    disabled={bookingLoading}
                    endIcon={bookingLoading ? <CircularProgress size={20} /> : <CheckCircle />}
                    sx={{ 
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #764ba2, #667eea)',
                      }
                    }}
                  >
                    {bookingLoading ? t('loading') : t('confirmBooking')}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={
                      (activeStep === 0 && !selectedDate) ||
                      (activeStep === 1 && !selectedTime)
                    }
                    endIcon={<ArrowForward />}
                  >
                    {t('next')}
                  </Button>
                )}
              </Box>
            )}
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
}