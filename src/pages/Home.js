import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Fade,
  Zoom
} from '@mui/material';
import {
  LocalHospital,
  CalendarMonth,
  Star,
  ArrowForward,
  Favorite,
  Security,
  Speed
} from '@mui/icons-material';

export default function Home() {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();

  // Features data
  const features = [
    {
      icon: <LocalHospital sx={{ fontSize: 50, color: '#1976d2' }} />,
      title: 'Expert Doctors',
      description: 'Access to verified doctors across all medical specialties'
    },
    {
      icon: <CalendarMonth sx={{ fontSize: 50, color: '#2e7d32' }} />,
      title: 'Instant Booking',
      description: 'Book your appointment in simple steps, anytime anywhere'
    },
    {
      icon: <Star sx={{ fontSize: 50, color: '#ed6c02' }} />,
      title: 'Trusted Reviews',
      description: 'Real patient reviews and ratings to help you choose'
    }
  ];

  // Stats data
  const stats = [
    { number: '500+', label: 'Doctors' },
    { number: '50K+', label: 'Patients' },
    { number: '100K+', label: 'Appointments' },
    { number: '4.8', label: 'Average Rating' }
  ];

  return (
    <Box>
      {/* ========== HERO SECTION ========== */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #0d47a1 100%)',
          color: 'white',
          py: { xs: 6, md: 10 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography
                    variant="h2"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '2rem', md: '3.5rem' },
                      lineHeight: 1.2
                    }}
                  >
                    Book Your Doctor
                    <br />
                    Appointment Online
                  </Typography>

                  <Typography
                    variant="h5"
                    sx={{
                      mb: 4,
                      opacity: 0.9,
                      fontWeight: 300,
                      lineHeight: 1.6
                    }}
                  >
                    Easy and fast medical appointment booking system
                    with real patient reviews and ratings
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/doctors')}
                      sx={{
                        bgcolor: 'white',
                        color: '#1976d2',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: '#f5f5f5',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s'
                      }}
                      endIcon={<ArrowForward />}
                    >
                      Find a Doctor
                    </Button>

                    {!currentUser && (
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate('/signup')}
                        sx={{
                          borderColor: 'white',
                          color: 'white',
                          px: 4,
                          py: 1.5,
                          fontSize: '1.1rem',
                          '&:hover': {
                            borderColor: 'white',
                            bgcolor: 'rgba(255,255,255,0.1)'
                          }
                        }}
                      >
                        Create Account
                      </Button>
                    )}
                  </Box>
                </Box>
              </Fade>
            </Grid>

            <Grid item xs={12} md={5}>
              <Zoom in timeout={1500}>
                <Paper
                  elevation={6}
                  sx={{
                    p: 3,
                    bgcolor: 'rgba(255,255,255,0.95)',
                    color: 'text.primary',
                    borderRadius: 3
                  }}
                >
                  <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 600 }}>
                    Why Choose Us?
                  </Typography>

                  {[
                    { icon: <Favorite color="error" />, text: 'Verified Doctors' },
                    { icon: <Security color="success" />, text: 'Secure Booking' },
                    { icon: <Speed color="primary" />, text: 'Instant Confirmation' }
                  ].map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        py: 1.5,
                        borderBottom: index < 2 ? '1px solid #eee' : 'none'
                      }}
                    >
                      {item.icon}
                      <Typography>{item.text}</Typography>
                    </Box>
                  ))}
                </Paper>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ========== STATS SECTION ========== */}
      <Box sx={{ bgcolor: '#f8f9fa', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    bgcolor: 'transparent'
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: '#1976d2',
                      mb: 0.5
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography color="text.secondary">
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ========== FEATURES SECTION ========== */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, mb: 1 }}
        >
          Our Features
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Everything you need for your healthcare journey
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 2,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* CTA Button */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/doctors')}
            sx={{
              px: 6,
              py: 1.5,
              fontSize: '1.1rem',
              borderRadius: 2
            }}
          >
            Explore All Doctors
          </Button>
        </Box>
      </Container>

      {/* ========== HOW IT WORKS SECTION ========== */}
      <Box sx={{ bgcolor: '#f0f7ff', py: 8 }}>
        <Container maxWidth="md">
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700, mb: 6 }}
          >
            How It Works
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                step: '1',
                title: 'Search',
                desc: 'Find doctors by specialty, location, or name'
              },
              {
                step: '2',
                title: 'Choose',
                desc: 'View profiles, ratings, and select your doctor'
              },
              {
                step: '3',
                title: 'Book',
                desc: 'Pick a date and time that works for you'
              },
              {
                step: '4',
                title: 'Visit',
                desc: 'Attend your appointment and get care'
              }
            ].map((item, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box textAlign="center">
                  <Paper
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      bgcolor: '#1976d2',
                      color: 'white',
                      fontSize: '1.5rem',
                      fontWeight: 700
                    }}
                  >
                    {item.step}
                  </Paper>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {item.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {item.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ========== USER SECTIONS ========== */}
      
      {/* For Patients */}
      {currentUser && userRole === 'patient' && (
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
              borderRadius: 3
            }}
          >
            <LocalHospital sx={{ fontSize: 50, color: '#1976d2', mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Welcome, {currentUser.displayName}! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              You are logged in as a Patient
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/doctors')}
              >
                Find a Doctor
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/appointments')}
              >
                My Appointments
              </Button>
            </Box>
          </Paper>
        </Container>
      )}

      {/* For Doctors */}
      {currentUser && userRole === 'doctor' && (
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
              borderRadius: 3
            }}
          >
            <LocalHospital sx={{ fontSize: 50, color: '#2e7d32', mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Welcome, Dr. {currentUser.displayName}! 👨‍⚕️
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              You are logged in as a Doctor
            </Typography>
            <Button
              variant="contained"
              size="large"
              color="success"
              onClick={() => navigate('/doctor-dashboard')}
              sx={{ px: 4 }}
            >
              Go to Dashboard
            </Button>
          </Paper>
        </Container>
      )}

      {/* For Guests */}
      {!currentUser && (
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 3
            }}
          >
            <Typography variant="h5" gutterBottom>
              Join Our Medical Community
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Register as a patient to book appointments or as a doctor to manage your practice
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/signup')}
              >
                Sign Up Now
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
              >
                Log In
              </Button>
            </Box>
          </Paper>
        </Container>
      )}

      {/* ========== FOOTER ========== */}
      <Box
        sx={{
          bgcolor: '#1565c0',
          color: 'white',
          py: 4,
          mt: 4
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Doctor Appointment
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Your trusted platform for booking medical appointments
                with the best doctors in your area.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button color="inherit" sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/doctors')}>
                  Find Doctors
                </Button>
                <Button color="inherit" sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/signup')}>
                  Create Account
                </Button>
                <Button color="inherit" sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/login')}>
                  Log In
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Contact
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Email: support@doctorapp.com
                <br />
                Phone: +20 123 456 7890
                <br />
                Location: Cairo, Egypt
              </Typography>
            </Grid>
          </Grid>
          <Box
            sx={{
              borderTop: '1px solid rgba(255,255,255,0.2)',
              mt: 3,
              pt: 3,
              textAlign: 'center'
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © 2024 Doctor Appointment App. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}