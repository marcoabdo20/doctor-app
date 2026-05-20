import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
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
  Tab
} from '@mui/material';
import { LocationOn, AttachMoney, AccessTime } from '@mui/icons-material';

export default function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const docRef = doc(db, 'doctors', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setDoctor({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('الطبيب غير موجود');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDoctor();
  }, [id]);

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
      {/* معلومات الطبيب الأساسية */}
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
            
            <Chip 
              label={doctor.specialty} 
              color="primary" 
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Rating value={doctor.rating || 0} precision={0.1} readOnly />
              <Typography sx={{ ml: 1 }}>
                {doctor.rating} ({doctor.reviewsCount} تقييم)
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn sx={{ color: 'text.secondary', ml: 0.5 }} />
              <Typography color="text.secondary">
                {doctor.location}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AttachMoney sx={{ color: 'success.main', ml: 0.5 }} />
              <Typography color="success.main" variant="h6">
                {doctor.price} جنيه للكشف
              </Typography>
            </Box>
            
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate(`/book/${doctor.id}`)}
            >
              احجز موعد الآن
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
          <Tab label="نبذة عن الطبيب" />
          <Tab label="مواعيد العمل" />
          <Tab label="التقييمات" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Typography>
              {doctor.bio || 'لا توجد نبذة متوفرة'}
            </Typography>
          )}

          {activeTab === 1 && (
            <Box>
              {doctor.availability && Object.entries(doctor.availability).map(([day, times]) => (
                <Box key={day} sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {translateDay(day)}
                  </Typography>
                  {times.length > 0 ? (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {times.map(time => (
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
                    <Typography color="text.secondary">لا يوجد مواعيد</Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}

          {activeTab === 2 && (
            <Typography color="text.secondary">
              سيتم إضافة التقييمات قريباً...
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

// ترجمة أيام الأسبوع
function translateDay(day) {
  const days = {
    saturday: 'السبت',
    sunday: 'الأحد',
    monday: 'الإثنين',
    tuesday: 'الثلاثاء',
    wednesday: 'الأربعاء',
    thursday: 'الخميس',
    friday: 'الجمعة'
  };
  return days[day] || day;
}