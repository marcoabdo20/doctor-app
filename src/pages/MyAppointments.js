import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, orderBy, doc, updateDoc, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Chip,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField,
  Fade,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { CalendarMonth, AccessTime, LocationOn, Cancel, RateReview, ArrowForward, Person } from '@mui/icons-material';

export default function MyAppointments() {
  const { currentUser } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === 'ar';

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [cancelDialog, setCancelDialog] = useState(null);
  const [reviewDialog, setReviewDialog] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    fetchAppointments();
  }, [currentUser]);

  async function fetchAppointments() {
    try {
      setLoading(true);
      setError('');

      console.log('Fetching appointments for patient:', currentUser.uid);

      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef,
        where('patientId', '==', currentUser.uid)
      );

      const snapshot = await getDocs(q);
      console.log('Found appointments:', snapshot.size);

      const apps = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort manually since we can't use orderBy with where on different fields
      apps.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB - dateA;
      });

      setAppointments(apps);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(isRTL ? 'حدث خطأ في جلب المواعيد' : 'Error fetching appointments');
    } finally {
      setLoading(false);
    }
  }

  async function cancelAppointment(appointmentId) {
    try {
      const docRef = doc(db, 'appointments', appointmentId);
      await updateDoc(docRef, { 
        status: 'cancelled', 
        updatedAt: new Date() 
      });
      setCancelDialog(null);
      fetchAppointments();
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      setError(isRTL ? 'حدث خطأ في إلغاء الموعد' : 'Error cancelling appointment');
    }
  }

  async function submitReview(appointment) {
    try {
      // Add review
      await addDoc(collection(db, 'reviews'), {
        patientId: currentUser.uid,
        patientName: currentUser.displayName,
        doctorId: appointment.doctorId,
        doctorName: appointment.doctorName,
        appointmentId: appointment.id,
        rating: rating,
        comment: reviewText,
        createdAt: new Date()
      });

      // Update appointment status
      const docRef = doc(db, 'appointments', appointment.id);
      await updateDoc(docRef, { 
        status: 'reviewed', 
        updatedAt: new Date() 
      });

      setReviewDialog(null);
      setRating(5);
      setReviewText('');
      fetchAppointments();
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(isRTL ? 'حدث خطأ في إرسال التقييم' : 'Error submitting review');
    }
  }

  const filteredAppointments = appointments.filter(app => {
    if (activeTab === 0) return ['pending', 'confirmed'].includes(app.status);
    if (activeTab === 1) return app.status === 'completed' || app.status === 'reviewed';
    if (activeTab === 2) return app.status === 'cancelled';
    return true;
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'success',
      completed: 'info',
      cancelled: 'error',
      reviewed: 'secondary'
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: isRTL ? 'معلق' : 'Pending',
      confirmed: isRTL ? 'مؤكد' : 'Confirmed',
      completed: isRTL ? 'مكتمل' : 'Completed',
      cancelled: isRTL ? 'ملغى' : 'Cancelled',
      reviewed: isRTL ? 'تم التقييم' : 'Reviewed'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Fade in timeout={500}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            {t('myAppointments')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Tabs 
            value={activeTab} 
            onChange={(e, v) => setActiveTab(v)}
            sx={{ mb: 3 }}
          >
            <Tab label={`${t('upcoming')} (${appointments.filter(a => ['pending', 'confirmed'].includes(a.status)).length})`} />
            <Tab label={`${t('completed')} (${appointments.filter(a => ['completed', 'reviewed'].includes(a.status)).length})`} />
            <Tab label={`${t('cancelled')} (${appointments.filter(a => a.status === 'cancelled').length})`} />
          </Tabs>

          {appointments.length === 0 ? (
            <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
              <CalendarMonth sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {isRTL ? 'لا توجد مواعيد' : 'No Appointments'}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
{isRTL ? 'لم تقم بحجز أي موعد بعد' : "You haven't booked any appointments yet"}              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/doctors')}
                startIcon={!isRTL && <ArrowForward />}
                endIcon={isRTL && <ArrowForward />}
                sx={{
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)'
                }}
              >
                {t('findDoctor')}
              </Button>
            </Paper>
          ) : filteredAppointments.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              {isRTL ? 'لا توجد مواعيد في هذا القسم' : 'No appointments in this section'}
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {filteredAppointments.map((app) => (
                <Grid item xs={12} md={6} key={app.id}>
                  <Card elevation={2} sx={{ borderRadius: 3, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {app.doctorName}
                          </Typography>
                          <Typography color="text.secondary" variant="body2">
                            {app.doctorSpecialty}
                          </Typography>
                        </Box>
                        <Chip 
                          label={getStatusLabel(app.status)} 
                          color={getStatusColor(app.status)}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>

                      <Divider sx={{ my: 1.5 }} />

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Person sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {isRTL ? 'المريض' : 'Patient'}: {app.patientName}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarMonth sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{app.date}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AccessTime sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{app.time}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LocationOn sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{app.price} {isRTL ? 'جنيه' : 'EGP'}</Typography>
                      </Box>

                      {app.notes && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}>
                          {isRTL ? 'ملاحظات' : 'Notes'}: {app.notes}
                        </Typography>
                      )}

                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        {['pending', 'confirmed'].includes(app.status) && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<Cancel />}
                            onClick={() => setCancelDialog(app)}
                            fullWidth
                          >
                            {t('cancelAppointment')}
                          </Button>
                        )}

                        {app.status === 'completed' && (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<RateReview />}
                            onClick={() => setReviewDialog(app)}
                            fullWidth
                            sx={{
                              background: 'linear-gradient(45deg, #667eea, #764ba2)'
                            }}
                          >
                            {t('writeReview')}
                          </Button>
                        )}

                        {app.status === 'reviewed' && (
                          <Chip 
                            label={isRTL ? 'تم التقييم' : 'Reviewed'} 
                            color="success" 
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Cancel Dialog */}
          <Dialog open={!!cancelDialog} onClose={() => setCancelDialog(null)}>
            <DialogTitle>{t('cancelAppointment')}</DialogTitle>
            <DialogContent>
              <Typography>
                {isRTL 
                  ? `هل أنت متأكد من إلغاء موعدك مع د. ${cancelDialog?.doctorName}؟`
                  : `Are you sure you want to cancel your appointment with Dr. ${cancelDialog?.doctorName}?`
                }
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {isRTL ? 'التاريخ' : 'Date'}: {cancelDialog?.date} | {isRTL ? 'الوقت' : 'Time'}: {cancelDialog?.time}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setCancelDialog(null)}>
                {isRTL ? 'إبقاء الموعد' : 'Keep Appointment'}
              </Button>
              <Button 
                color="error" 
                variant="contained"
                onClick={() => cancelAppointment(cancelDialog.id)}
              >
                {t('cancelAppointment')}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Review Dialog */}
          <Dialog open={!!reviewDialog} onClose={() => setReviewDialog(null)} maxWidth="sm" fullWidth>
            <DialogTitle>{t('writeReview')}</DialogTitle>
            <DialogContent>
              <Typography gutterBottom sx={{ mb: 2 }}>
                {isRTL ? 'د.' : 'Dr.'} {reviewDialog?.doctorName}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography component="legend" gutterBottom>{t('yourRating')}</Typography>
                <Rating
                  value={rating}
                  onChange={(e, newValue) => setRating(newValue)}
                  size="large"
                />
              </Box>

              <TextField
                label={t('yourReview')}
                multiline
                rows={4}
                fullWidth
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder={isRTL ? 'شارك تجربتك مع هذا الطبيب...' : 'Share your experience with this doctor...'}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setReviewDialog(null)}>
                {isRTL ? 'تخطي' : 'Skip'}
              </Button>
              <Button 
                variant="contained" 
                onClick={() => submitReview(reviewDialog)}
                disabled={!rating}
                sx={{
                  background: 'linear-gradient(45deg, #667eea, #764ba2)'
                }}
              >
                {t('submitReview')}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Fade>
    </Container>
  );
}