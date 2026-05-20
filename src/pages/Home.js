import { useAuth } from '../context/AuthContext';
import { 
  Box, 
  Typography, 
  Container,
  Paper,
  Button 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LocalHospital, CalendarMonth, Star } from '@mui/icons-material';

export default function Home() {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ 
        bgcolor: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        color: 'white',
        py: 8,
        textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <Typography variant="h2" gutterBottom>
            احجز موعدك مع أفضل الأطباء
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            نظام حجز مواعيد طبية سهل وسريع مع تقييمات حقيقية من المرضى
          </Typography>
          
          {!currentUser && (
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                bgcolor: 'white', 
                color: '#1976d2',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
              onClick={() => navigate('/signup')}
            >
              ابدأ الآن - إنشاء حساب
            </Button>
          )}
        </Container>
      </Box>

      {/* المميزات */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
          لماذا تختار منصتنا؟
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 3, 
          flexWrap: 'wrap' 
        }}>
          <Paper sx={{ p: 3, textAlign: 'center', width: 280 }}>
            <LocalHospital sx={{ fontSize: 50, color: '#1976d2', mb: 2 }} />
            <Typography variant="h6">أطباء متخصصون</Typography>
            <Typography color="text.secondary">
              مجموعة واسعة من الأطباء في جميع التخصصات
            </Typography>
          </Paper>
          
          <Paper sx={{ p: 3, textAlign: 'center', width: 280 }}>
            <CalendarMonth sx={{ fontSize: 50, color: '#2e7d32', mb: 2 }} />
            <Typography variant="h6">حجز فوري</Typography>
            <Typography color="text.secondary">
              احجز موعدك بخطوات بسيطة وفي أي وقت
            </Typography>
          </Paper>
          
          <Paper sx={{ p: 3, textAlign: 'center', width: 280 }}>
            <Star sx={{ fontSize: 50, color: '#ed6c02', mb: 2 }} />
            <Typography variant="h6">تقييمات موثوقة</Typography>
            <Typography color="text.secondary">
              رؤية تقييمات حقيقية من مرضى سابقين
            </Typography>
          </Paper>
        </Box>
      </Container>

      {/* حالة المستخدم */}
      {currentUser && (
        <Container maxWidth="md" sx={{ pb: 6 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              مرحباً بك، {currentUser.displayName}! 👋
            </Typography>
            <Typography color="text.secondary">
              أنت مسجل كـ: {userRole === 'doctor' ? 'طبيب' : 'مريض'}
            </Typography>
          </Paper>
        </Container>
      )}
    </Box>
  );
}