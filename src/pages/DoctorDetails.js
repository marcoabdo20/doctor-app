import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../hooks/useReviews';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Rating,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  LocationOn,
  AttachMoney,
  AccessTime,
  CalendarMonth,
  Star,
  ArrowBack,
} from '@mui/icons-material';

export default function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const { reviews, loading: reviewsLoading, averageRating, refresh } = useReviews(id);

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const docRef = doc(db, 'doctors', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDoctor({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Doctor not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDoctor();
  }, [id]);

  const getDayName = (dateString) => {
    const days = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const getNext7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        }),
      });
    }
    return days;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!doctor) return null;

  return (
    <Container sx={{ py: 4 }}>
      {/* زر الرجوع */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/doctors')}
        sx={{ mb: 2 }}
      >
        Back to Doctors
      </Button>

      {/* معلومات الطبيب */}
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Avatar
              src={doctor.image}
              alt={doctor.name}
              sx={{ width: 200, height: 200, mx: 'auto' }}
            />
          </Grid>

          <Grid item xs={12} md={9}>
            <Typography variant="h4" gutterBottom>
              {doctor.name}
            </Typography>

            <Chip label={doctor.specialty} color="primary" sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Rating
                value={averageRating || doctor.rating || 0}
                precision={0.1}
                readOnly
              />
              <Typography sx={{ ml: 1 }}>
                {averageRating || doctor.rating || 0} ({reviews.length || doctor.reviewsCount || 0} reviews)
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn sx={{ color: 'text.secondary', mr: 0.5 }} />
              <Typography color="text.secondary">{doctor.location}</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AttachMoney sx={{ color: 'success.main', mr: 0.5 }} />
              <Typography color="success.main" variant="h6">
                {doctor.price} EGP per visit
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(`/book/${doctor.id}`)}
            >
              Book Appointment
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* التبويبات */}
      <Paper elevation={2}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          centered
        >
          <Tab label="About" />
          <Tab label="Schedule" />
          <Tab label={`Reviews (${reviews.length})`} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* About Tab */}
          {activeTab === 0 && (
            <Typography sx={{ lineHeight: 1.8 }}>
              {doctor.bio || 'No biography available.'}
            </Typography>
          )}

          {/* Schedule Tab */}
          {activeTab === 1 && (
            <Box>
              {doctor.availability &&
                Object.entries(doctor.availability).map(([day, times]) => (
                  <Box key={day} sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
                      {day}
                    </Typography>
                    {times.length > 0 ? (
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {times.map((time) => (
                          <Chip
                            key={time}
                            label={time}
                            icon={<AccessTime />}
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    ) : (
                      <Typography color="text.secondary">No available times</Typography>
                    )}
                  </Box>
                ))}
            </Box>
          )}

          {/* Reviews Tab */}
          {activeTab === 2 && (
            <Box>
              {/* نموذج التقييم */}
              {currentUser && (
                <ReviewForm
                  doctorId={doctor.id}
                  doctorName={doctor.name}
                  onSuccess={refresh}
                />
              )}

              {/* قائمة التقييمات */}
              {reviewsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : reviews.length === 0 ? (
                <Alert severity="info">
                  No reviews yet. Be the first to review!
                </Alert>
              ) : (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Patient Reviews
                  </Typography>
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
}