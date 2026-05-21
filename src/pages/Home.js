import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Container, Paper, Button, Grid,
  Card, CardContent, Fade, Zoom, Chip, useTheme,
} from '@mui/material';
import {
  LocalHospital, CalendarMonth, Star, ArrowForward,
  Favorite, Security, Speed, VerifiedUser, AccessTime,
  ArrowBack,
} from '@mui/icons-material';

// ─── Design Tokens ────────────────────────────────────────────────────────────

const T = {
  teal50:  '#E8F5F0',
  teal100: '#C3E8D8',
  teal400: '#1D9E75',
  teal600: '#0F6E56',
  teal800: '#085041',
  neutral50:  '#F7F8FA',
  neutral100: '#ECEEF2',
  neutral600: '#6B7280',
  purple:  '#7C3AED',
  purpleL: '#EDE9FE',
};

// ─── Arrow helper ─────────────────────────────────────────────────────────────
// Shows forward or backward arrow based on text direction
function DirectionalArrow({ isRTL, sx }) {
  return isRTL
    ? <ArrowBack sx={sx} />
    : <ArrowForward sx={sx} />;
}

// ─── Section Title ────────────────────────────────────────────────────────────

function SectionTitle({ children, subtitle, isRTL }) {
  return (
    <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 }, direction: isRTL ? 'rtl' : 'ltr' }}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          fontSize: { xs: '1.6rem', sm: '2rem', md: '2.4rem' },
          color: 'text.primary',
          mb: 1,
          letterSpacing: isRTL ? 0 : '-0.5px',
        }}
      >
        {children}
      </Typography>
      {subtitle && (
        <Typography
          sx={{
            fontSize: { xs: 14, sm: 15.5 },
            color: T.neutral600,
            maxWidth: 540,
            mx: 'auto',
            lineHeight: 1.65,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ currentUser, isRTL, navigate, t }) {
  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${T.teal600} 0%, ${T.teal800} 60%, #042E22 100%)`,
        color: 'white',
        py: { xs: 7, sm: 10, md: 14 },
        position: 'relative',
        overflow: 'hidden',
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      {/* Background shapes */}
      {[
        { top: -100, right: -100, size: 380, opacity: 0.08 },
        { bottom: -140, left: -140, size: 460, opacity: 0.05 },
        { top: '30%', left: '60%', size: 160, opacity: 0.06 },
      ].map((s, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            top: s.top,
            bottom: s.bottom,
            left: s.left,
            right: s.right,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: `rgba(255,255,255,${s.opacity})`,
            pointerEvents: 'none',
          }}
        />
      ))}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">

          {/* Left / main column */}
          <Grid item xs={12} md={7}>
            <Fade in timeout={700}>
              <Box>
                <Chip
                  label={t('trustedPlatform')}
                  sx={{
                    mb: { xs: 2, sm: 2.5 },
                    bgcolor: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: { xs: 11, sm: 12 },
                    border: '1px solid rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(6px)',
                  }}
                />
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem' },
                    lineHeight: { xs: 1.2, md: 1.1 },
                    mb: { xs: 1.5, sm: 2 },
                    letterSpacing: isRTL ? 0 : '-1px',
                    textShadow: '0 2px 16px rgba(0,0,0,0.2)',
                  }}
                >
                  {t('heroTitle')}
                </Typography>

                <Typography
                  sx={{
                    mb: { xs: 3, sm: 4 },
                    opacity: 0.85,
                    fontWeight: 400,
                    fontSize: { xs: 14, sm: 16 },
                    lineHeight: 1.7,
                    maxWidth: 520,
                  }}
                >
                  {t('heroSubtitle')}
                </Typography>

                <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2 }, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/doctors')}
                    endIcon={<DirectionalArrow isRTL={isRTL} />}
                    sx={{
                      bgcolor: '#fff',
                      color: '#042E22',
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1.25, sm: 1.5 },
                      fontSize: { xs: '0.95rem', sm: '1rem' },
                      fontWeight: 800,
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                      transition: 'all .2s',
                      '&:hover': {
                        bgcolor: '#1dc481',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 28px rgba(0,0,0,0.25)',
                      },
                    }}
                  >
                    {t('findDoctor')}
                  </Button>

                  {!currentUser && (
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/signup')}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.5)',
                        color: 'white',
                        px: { xs: 3, sm: 4 },
                        py: { xs: 1.25, sm: 1.5 },
                        fontSize: { xs: '0.95rem', sm: '1rem' },
                        fontWeight: 700,
                        borderRadius: '12px',
                        backdropFilter: 'blur(6px)',
                        transition: 'all .2s',
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: 'rgba(255,255,255,0.15)',
                        },
                      }}
                    >
                      {t('createAccount')}
                    </Button>
                  )}
                </Box>
              </Box>
            </Fade>
          </Grid>

          {/* Right / info card */}
          <Grid item xs={12} md={5}>
            <Zoom in timeout={900}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 3.5 },
                  bgcolor: 'rgba(255,255,255,0.97)',
                  borderRadius: { xs: '16px', sm: '20px' },
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.6)',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
                }}
              >
                <Typography
                  sx={{
                    color: T.teal600,
                    fontWeight: 800,
                    fontSize: { xs: 15, sm: 16 },
                    mb: 2,
                    textAlign: isRTL ? 'right' : 'left',
                  }}
                >
                  {t('whyChooseUs')}
                </Typography>

                {[
                  { icon: <Favorite sx={{ fontSize: 18, color: '#E11D48' }} />, text: t('verifiedDoctors'),   bg: '#FFF1F2' },
                  { icon: <Security sx={{ fontSize: 18, color: T.teal400 }} />, text: t('secureBooking'),     bg: T.teal50  },
                  { icon: <Speed    sx={{ fontSize: 18, color: T.purple  }} />, text: t('instantConfirmation'), bg: T.purpleL },
                ].map((item, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      py: { xs: 1.25, sm: 1.5 },
                      px: 1.5,
                      borderBottom: i < 2 ? `1px solid ${T.neutral100}` : 'none',
                      borderRadius: i === 2 ? '10px' : 0,
                      flexDirection: isRTL ? 'row-reverse' : 'row',
                      transition: 'bgcolor .15s',
                      '&:hover': { bgcolor: T.neutral50, borderRadius: '10px' },
                    }}
                  >
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: '10px',
                        bgcolor: item.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: { xs: 13, sm: 13.5 },
                        fontWeight: 600,
                        color: 'text.primary',
                        textAlign: isRTL ? 'right' : 'left',
                      }}
                    >
                      {item.text}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            </Zoom>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function StatsBar({ stats, isRTL }) {
  return (
    <Box sx={{ bgcolor: T.neutral50, borderBottom: `1px solid ${T.neutral100}`, py: { xs: 4, sm: 5 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center" direction={isRTL ? 'row-reverse' : 'row'}>
          {stats.map((stat, i) => (
            <Grid item xs={6} sm={3} key={i}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: { xs: 1.5, sm: 2 },
                  transition: 'transform .2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                    background: `linear-gradient(135deg, ${T.teal400} 0%, ${T.teal800} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.1,
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography
                  sx={{ color: T.neutral600, fontWeight: 600, fontSize: { xs: 12, sm: 13 }, mt: 0.5 }}
                >
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

function Features({ features, isRTL, navigate, t }) {
  const icons = [
    { bg: T.teal50,  color: T.teal400  },
    { bg: '#EFF6FF', color: '#3B82F6'  },
    { bg: '#FFF7ED', color: '#F97316'  },
  ];

  return (
    <Box sx={{ py: { xs: 7, md: 10 }, bgcolor: '#fff' }}>
      <Container maxWidth="lg">
        <SectionTitle
          isRTL={isRTL}
          subtitle={t('featuresSubtitle')}
        >
          {t('ourFeatures')}
        </SectionTitle>

        <Grid container spacing={{ xs: 2.5, md: 3.5 }} justifyContent="center">
          {features.map((feature, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  p: { xs: 0.5, sm: 1 },
                  border: `1px solid ${T.neutral100}`,
                  borderRadius: { xs: '14px', md: '18px' },
                  transition: 'all .25s',
                  direction: isRTL ? 'rtl' : 'ltr',
                  '&:hover': {
                    borderColor: T.teal100,
                    transform: 'translateY(-8px)',
                    boxShadow: `0 16px 40px rgba(29,158,117,0.10)`,
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: { xs: 3, sm: 3.5 } }}>
                  <Box
                    sx={{
                      width: { xs: 56, sm: 64 },
                      height: { xs: 56, sm: 64 },
                      borderRadius: '16px',
                      bgcolor: icons[i].bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2.5,
                    }}
                  >
                    <Box sx={{ '& > svg': { fontSize: '28px !important', color: icons[i].color } }}>
                      {feature.icon}
                    </Box>
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: 15, sm: 16 },
                      color: 'text.primary',
                      mb: 1,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography sx={{ color: T.neutral600, fontSize: { xs: 13, sm: 14 }, lineHeight: 1.7 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: { xs: 5, md: 7 } }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/doctors')}
            endIcon={<DirectionalArrow isRTL={isRTL} />}
            sx={{
              px: { xs: 4, sm: 6 },
              py: { xs: 1.25, sm: 1.5 },
              fontSize: { xs: '0.95rem', sm: '1rem' },
              fontWeight: 700,
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${T.teal400} 0%, ${T.teal600} 100%)`,
              boxShadow: `0 4px 16px ${T.teal400}44`,
              transition: 'all .2s',
              '&:hover': {
                background: `linear-gradient(135deg, ${T.teal600} 0%, ${T.teal800} 100%)`,
                transform: 'translateY(-3px)',
                boxShadow: `0 8px 28px ${T.teal400}55`,
              },
            }}
          >
            {t('exploreDoctors')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

function HowItWorks({ steps, isRTL, t }) {
  return (
    <Box sx={{ bgcolor: T.neutral50, py: { xs: 7, md: 10 }, borderTop: `1px solid ${T.neutral100}` }}>
      <Container maxWidth="md">
        <SectionTitle isRTL={isRTL}>{t('howItWorks')}</SectionTitle>

        <Grid container spacing={{ xs: 3, sm: 4 }} direction={isRTL ? 'row-reverse' : 'row'}>
          {steps.map((item, i) => (
            <Grid item xs={6} md={3} key={i}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: { xs: 56, sm: 68 },
                    height: { xs: 56, sm: 68 },
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: { xs: 2, sm: 2.5 },
                    background: `linear-gradient(135deg, ${T.teal400} 0%, ${T.teal600} 100%)`,
                    color: 'white',
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    fontWeight: 900,
                    boxShadow: `0 6px 20px ${T.teal400}44`,
                    border: '3px solid #fff',
                    outline: `2px solid ${T.teal100}`,
                  }}
                >
                  {item.step}
                </Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: 13, sm: 14.5 },
                    color: 'text.primary',
                    mb: 0.75,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    color: T.neutral600,
                    fontSize: { xs: 11.5, sm: 13 },
                    lineHeight: 1.6,
                  }}
                >
                  {item.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

// ─── CTA Cards ────────────────────────────────────────────────────────────────

function PatientCTA({ currentUser, isRTL, navigate, t }) {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          textAlign: 'center',
          borderRadius: { xs: '16px', sm: '20px' },
          border: `1px solid ${T.teal100}`,
          background: `linear-gradient(135deg, ${T.teal50} 0%, #F0FAF6 100%)`,
          direction: isRTL ? 'rtl' : 'ltr',
        }}
      >
        <Box
          sx={{
            width: { xs: 60, sm: 72 },
            height: { xs: 60, sm: 72 },
            borderRadius: '50%',
            bgcolor: T.teal50,
            border: `2px solid ${T.teal100}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2.5,
          }}
        >
          <LocalHospital sx={{ fontSize: { xs: 28, sm: 34 }, color: T.teal400 }} />
        </Box>
        <Typography sx={{ fontWeight: 800, fontSize: { xs: 18, sm: 22 }, mb: 1 }}>
          {t('welcome')}, {currentUser.displayName}! 👋
        </Typography>
        <Typography sx={{ color: T.neutral600, mb: 3.5, fontSize: { xs: 13.5, sm: 15 }, lineHeight: 1.65 }}>
          {t('patientWelcomeMessage')}
        </Typography>
        <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2 }, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/doctors')}
            endIcon={<DirectionalArrow isRTL={isRTL} />}
            sx={{
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${T.teal400} 0%, ${T.teal600} 100%)`,
              boxShadow: `0 3px 12px ${T.teal400}44`,
              fontWeight: 700,
              px: { xs: 3, sm: 4 },
              '&:hover': { background: `linear-gradient(135deg, ${T.teal600} 0%, ${T.teal800} 100%)` },
            }}
          >
            {t('findDoctor')}
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/appointments')}
            startIcon={<CalendarMonth />}
            sx={{
              borderRadius: '12px',
              border: `2px solid ${T.teal100}`,
              color: T.teal600,
              fontWeight: 700,
              px: { xs: 3, sm: 4 },
              '&:hover': { border: `2px solid ${T.teal400}`, bgcolor: T.teal50 },
            }}
          >
            {t('myAppointments')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

function DoctorCTA({ currentUser, isRTL, navigate, t }) {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          textAlign: 'center',
          borderRadius: { xs: '16px', sm: '20px' },
          border: `1px solid ${T.teal100}`,
          background: `linear-gradient(135deg, #F0FAF6 0%, #E8F5F0 100%)`,
          direction: isRTL ? 'rtl' : 'ltr',
        }}
      >
        <Box
          sx={{
            width: { xs: 60, sm: 72 },
            height: { xs: 60, sm: 72 },
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${T.teal400} 0%, ${T.teal600} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2.5,
            boxShadow: `0 4px 16px ${T.teal400}44`,
          }}
        >
          <LocalHospital sx={{ fontSize: { xs: 28, sm: 34 }, color: '#fff' }} />
        </Box>
        <Typography sx={{ fontWeight: 800, fontSize: { xs: 18, sm: 22 }, mb: 1 }}>
          {t('welcome')}, Dr. {currentUser.displayName}! 👨‍⚕️
        </Typography>
        <Typography sx={{ color: T.neutral600, mb: 3.5, fontSize: { xs: 13.5, sm: 15 }, lineHeight: 1.65 }}>
          {t('doctorWelcomeMessage')}
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/doctor-dashboard')}
          endIcon={<DirectionalArrow isRTL={isRTL} />}
          sx={{
            borderRadius: '12px',
            px: { xs: 4, sm: 5 },
            fontWeight: 700,
            background: `linear-gradient(135deg, ${T.teal400} 0%, ${T.teal600} 100%)`,
            boxShadow: `0 3px 12px ${T.teal400}44`,
            '&:hover': { background: `linear-gradient(135deg, ${T.teal600} 0%, ${T.teal800} 100%)` },
          }}
        >
          {t('goToDashboard')}
        </Button>
      </Paper>
    </Container>
  );
}

function GuestCTA({ isRTL, navigate, t }) {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          textAlign: 'center',
          borderRadius: { xs: '16px', sm: '20px' },
          border: `1px solid ${T.neutral100}`,
          bgcolor: T.neutral50,
          direction: isRTL ? 'rtl' : 'ltr',
        }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: { xs: 18, sm: 22 }, mb: 1 }}>
          {t('joinCommunity')}
        </Typography>
        <Typography sx={{ color: T.neutral600, mb: 3.5, fontSize: { xs: 13.5, sm: 15 }, lineHeight: 1.65 }}>
          {t('joinMessage')}
        </Typography>
        <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2 }, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/signup')}
            endIcon={<DirectionalArrow isRTL={isRTL} />}
            sx={{
              borderRadius: '12px',
              px: { xs: 3, sm: 4 },
              fontWeight: 700,
              background: `linear-gradient(135deg, ${T.teal400} 0%, ${T.teal600} 100%)`,
              boxShadow: `0 3px 12px ${T.teal400}44`,
              '&:hover': { background: `linear-gradient(135deg, ${T.teal600} 0%, ${T.teal800} 100%)` },
            }}
          >
            {t('signup')}
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/login')}
            sx={{
              borderRadius: '12px',
              px: { xs: 3, sm: 4 },
              fontWeight: 700,
              border: `2px solid ${T.neutral100}`,
              color: T.neutral600,
              '&:hover': { border: `2px solid ${T.teal400}`, color: T.teal600, bgcolor: T.teal50 },
            }}
          >
            {t('login')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ isRTL, navigate, t }) {
  const links = [
    { text: t('home'),    path: '/'        },
    { text: t('doctors'), path: '/doctors' },
    { text: t('signup'),  path: '/signup'  },
    { text: t('login'),   path: '/login'   },
  ];

  return (
    <Box sx={{ bgcolor: '#0D1B14', color: 'white', pt: { xs: 6, sm: 8 }, pb: { xs: 3, sm: 4 } }}>
      <Container maxWidth="lg">
        <Grid
          container
          spacing={{ xs: 4, sm: 5 }}
          direction={isRTL ? 'row-reverse' : 'row'}
        >
          {/* Brand */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 2,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                justifyContent: { xs: 'center', md: isRTL ? 'flex-end' : 'flex-start' },
              }}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '10px',
                  background: `linear-gradient(135deg, ${T.teal400} 0%, ${T.teal600} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LocalHospital sx={{ fontSize: 20, color: '#fff' }} />
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: 18 }}>
                {t('appName')}
              </Typography>
            </Box>
            <Typography
              sx={{
                opacity: 0.6,
                fontSize: { xs: 13, sm: 13.5 },
                lineHeight: 1.75,
                textAlign: { xs: 'center', md: isRTL ? 'right' : 'left' },
              }}
            >
              {t('footerDescription')}
            </Typography>
          </Grid>

          {/* Quick links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 14,
                mb: 2,
                opacity: 0.9,
                textAlign: { xs: 'center', sm: isRTL ? 'right' : 'left' },
              }}
            >
              {t('quickLinks')}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                alignItems: { xs: 'center', sm: isRTL ? 'flex-end' : 'flex-start' },
              }}
            >
              {links.map((link) => (
                <Button
                  key={link.path}
                  color="inherit"
                  onClick={() => navigate(link.path)}
                  sx={{
                    opacity: 0.7,
                    fontWeight: 500,
                    fontSize: { xs: 13, sm: 13.5 },
                    justifyContent: { xs: 'center', sm: isRTL ? 'flex-end' : 'flex-start' },
                    minWidth: 0,
                    px: 1,
                    '&:hover': { opacity: 1, color: T.teal100 },
                  }}
                >
                  {link.text}
                </Button>
              ))}
            </Box>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 14,
                mb: 2,
                opacity: 0.9,
                textAlign: { xs: 'center', sm: isRTL ? 'right' : 'left' },
              }}
            >
              {t('contact')}
            </Typography>
            <Typography
              sx={{
                opacity: 0.6,
                fontSize: { xs: 13, sm: 13.5 },
                lineHeight: 2,
                textAlign: { xs: 'center', sm: isRTL ? 'right' : 'left' },
                direction: 'ltr',
              }}
            >
              Email: support@tabibak.com
              <br />
              Tel: +20 123 456 7890
              <br />
              Cairo, Egypt
            </Typography>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            mt: { xs: 5, sm: 6 },
            pt: 3,
            textAlign: 'center',
          }}
        >
          <Typography sx={{ opacity: 0.4, fontSize: 12.5 }}>
            © 2024 {t('appName')}. {t('allRightsReserved')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

// ─── Home (main) ──────────────────────────────────────────────────────────────

export default function Home() {
  const { currentUser, userRole } = useAuth();
  const { t, language }          = useLanguage();
  const navigate = useNavigate();
  const isRTL    = language === 'ar';

  const features = [
    {
      icon: <VerifiedUser />,
      title: t('expertDoctors'),
      description: t('expertDoctorsDesc'),
    },
    {
      icon: <AccessTime />,
      title: t('instantBooking'),
      description: t('instantBookingDesc'),
    },
    {
      icon: <Star />,
      title: t('trustedReviews'),
      description: t('trustedReviewsDesc'),
    },
  ];

  const stats = [
    { number: '500+', label: t('expertDoctors') },
    { number: '50K+', label: t('patients')       },
    { number: '100K+', label: t('appointments')  },
    { number: '4.8★', label: t('rating')         },
  ];

  const steps = [
    { step: '1', title: t('step1'), desc: t('step1Desc') },
    { step: '2', title: t('step2'), desc: t('step2Desc') },
    { step: '3', title: t('step3'), desc: t('step3Desc') },
    { step: '4', title: t('step4'), desc: t('step4Desc') },
  ];

  return (
    <Box dir={isRTL ? 'rtl' : 'ltr'}>
      <Hero currentUser={currentUser} isRTL={isRTL} navigate={navigate} t={t} />
      <StatsBar stats={stats} isRTL={isRTL} />
      <Features features={features} isRTL={isRTL} navigate={navigate} t={t} />
      <HowItWorks steps={steps} isRTL={isRTL} t={t} />

      {currentUser && userRole === 'patient' && (
        <PatientCTA currentUser={currentUser} isRTL={isRTL} navigate={navigate} t={t} />
      )}
      {currentUser && userRole === 'doctor' && (
        <DoctorCTA currentUser={currentUser} isRTL={isRTL} navigate={navigate} t={t} />
      )}
      {!currentUser && (
        <GuestCTA isRTL={isRTL} navigate={navigate} t={t} />
      )}

      <Footer isRTL={isRTL} navigate={navigate} t={t} />
    </Box>
  );
}