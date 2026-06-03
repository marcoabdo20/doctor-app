import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Container, Paper, Button, Grid,
  Card, CardContent, Fade, Zoom, Chip, useTheme,
  Stack,
} from '@mui/material';
import {
  LocalHospital, CalendarMonth, Star, ArrowForward,
  Favorite, Security, Speed, VerifiedUser, AccessTime,
  ArrowBack, TrendingUp, People, Schedule, MedicalServices,
  LocationOn, Phone, Email,
} from '@mui/icons-material';

// ─── Design Tokens ────────────────────────────────────────────────────────────

const T = {
  teal50: '#E8F5F0',
  teal100: '#C3E8D8',
  teal200: '#9DD8C4',
  teal400: '#1D9E75',
  teal500: '#168A63',
  teal600: '#0F6E56',
  teal800: '#085041',
  teal900: '#042E22',
  neutral50: '#F7F8FA',
  neutral100: '#ECEEF2',
  neutral200: '#D1D5DB',
  neutral300: '#C8CDD8',
  neutral400: '#9CA3AF',
  neutral500: '#6B7280',
  neutral600: '#4B5563',
  neutral700: '#374151',
  neutral800: '#1F2937',
  neutral900: '#111827',
  white: '#FFFFFF',
  purple: '#7C3AED',
  purpleL: '#EDE9FE',
  amber: '#F59E0B',
  amberL: '#FEF3C7',
  rose: '#E11D48',
  roseL: '#FFF1F2',
  blue: '#3B82F6',
  blueL: '#EFF6FF',
};

// ─── Arrow helper ─────────────────────────────────────────────────────────────

function DirectionalArrow({ isRTL, sx }) {
  return isRTL
    ? <ArrowBack sx={sx} />
    : <ArrowForward sx={sx} />;
}

// ─── Section Title ────────────────────────────────────────────────────────────

function SectionTitle({ children, subtitle, isRTL }) {
  return (
    <Box sx={{ textAlign: 'center', mb: { xs: 5, sm: 6, md: 8 }, direction: isRTL ? 'rtl' : 'ltr' }}>
      <Typography
        sx={{
          fontWeight: 900,
          fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
          color: T.neutral900,
          mb: 1.5,
          letterSpacing: isRTL ? 0 : '-0.02em',
          lineHeight: 1.2,
        }}
      >
        {children}
      </Typography>
      {subtitle && (
        <Typography
          sx={{
            fontSize: { xs: 15, sm: 16, md: 17 },
            color: T.neutral500,
            maxWidth: 560,
            mx: 'auto',
            lineHeight: 1.7,
            fontWeight: 400,
          }}
        >
          {subtitle}
        </Typography>
      )}
      <Box
        sx={{
          width: 48,
          height: 4,
          borderRadius: 2,
          background: `linear-gradient(90deg, ${T.teal400}, ${T.teal600})`,
          mx: 'auto',
          mt: 3,
        }}
      />
    </Box>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ currentUser, isRTL, navigate, t }) {
  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${T.teal800} 0%, ${T.teal900} 50%, #021916 100%)`,
        color: T.white,
        py: { xs: 8, sm: 12, md: 16 },
        position: 'relative',
        overflow: 'hidden',
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      {/* Animated background shapes */}
      {[...Array(5)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: { xs: 200, sm: 300, md: 400 },
            height: { xs: 200, sm: 300, md: 400 },
            borderRadius: '50%',
            background: `radial-gradient(circle, ${T.teal400}15 0%, transparent 70%)`,
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 80}%`,
            animation: `float ${8 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 1.5}s`,
            pointerEvents: 'none',
          }}
        />
      ))}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">

          {/* Left / main column */}
          <Grid item xs={12} md={7}>
            <Fade in timeout={700}>
              <Box>
                <Chip
                  icon={<TrendingUp sx={{ fontSize: 14, color: T.teal400 }} />}
                  label={t('trustedPlatform')}
                  sx={{
                    mb: { xs: 3, sm: 4 },
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: T.white,
                    fontWeight: 700,
                    fontSize: { xs: 12, sm: 13 },
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    px: 1,
                    py: 0.5,
                    '& .MuiChip-icon': { color: T.teal400 },
                  }}
                />
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                    lineHeight: { xs: 1.15, md: 1.05 },
                    mb: { xs: 2, sm: 3 },
                    letterSpacing: isRTL ? 0 : '-0.03em',
                    textShadow: '0 4px 24px rgba(0,0,0,0.3)',
                  }}
                >
                  {t('heroTitle')}
                </Typography>

                <Typography
                  sx={{
                    mb: { xs: 4, sm: 5 },
                    opacity: 0.75,
                    fontWeight: 400,
                    fontSize: { xs: 16, sm: 18, md: 20 },
                    lineHeight: 1.7,
                    maxWidth: 540,
                  }}
                >
                  {t('heroSubtitle')}
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 2.5 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/doctors')}
                    endIcon={<DirectionalArrow isRTL={isRTL} sx={{ fontSize: 20 }} />}
                    sx={{
                      bgcolor: T.white,
                      color: T.teal900,
                      px: { xs: 4, sm: 5 },
                      py: { xs: 1.5, sm: 1.75 },
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      fontWeight: 800,
                      borderRadius: '14px',
                      boxShadow: '0 8px 32px rgba(255,255,255,0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: T.teal50,
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(255,255,255,0.3)',
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
                        borderColor: 'rgba(255,255,255,0.4)',
                        color: T.white,
                        px: { xs: 4, sm: 5 },
                        py: { xs: 1.5, sm: 1.75 },
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        fontWeight: 700,
                        borderRadius: '14px',
                        borderWidth: 2,
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: T.white,
                          bgcolor: 'rgba(255,255,255,0.1)',
                          transform: 'translateY(-4px)',
                        },
                      }}
                    >
                      {t('createAccount')}
                    </Button>
                  )}
                </Stack>

                {/* Trust badges */}
                <Stack
                  direction="row"
                  spacing={{ xs: 3, sm: 4 }}
                  sx={{ mt: { xs: 5, sm: 6 }, opacity: 0.6 }}
                >
                  {[t('verified'), t('secure'), t('24_7')].map((text, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: T.teal400,
                        }}
                      />
                      <Typography sx={{ fontSize: { xs: 12, sm: 13 }, fontWeight: 500 }}>
                        {text}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Fade>
          </Grid>

          {/* Right / info card */}
          <Grid item xs={12} md={5}>
            <Zoom in timeout={900}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4 },
                  bgcolor: 'rgba(255,255,255,0.95)',
                  borderRadius: { xs: '20px', sm: '24px' },
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
                }}
              >
                <Typography
                  sx={{
                    color: T.teal800,
                    fontWeight: 800,
                    fontSize: { xs: 16, sm: 18 },
                    mb: 3,
                    textAlign: isRTL ? 'right' : 'left',
                  }}
                >
                  {t('whyChooseUs')}
                </Typography>

                {[
                  { icon: <VerifiedUser sx={{ fontSize: 22, color: T.teal500 }} />, text: t('verifiedDoctors'), bg: T.teal50 },
                  { icon: <Security sx={{ fontSize: 22, color: T.blue }} />, text: t('secureBooking'), bg: T.blueL },
                  { icon: <Speed sx={{ fontSize: 22, color: T.amber }} />, text: t('instantConfirmation'), bg: T.amberL },
                  { icon: <Schedule sx={{ fontSize: 22, color: T.purple }} />, text: t('flexibleSchedule'), bg: T.purpleL },
                ].map((item, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2.5,
                      py: { xs: 1.5, sm: 2 },
                      px: 2,
                      borderBottom: i < 3 ? `1px solid ${T.neutral100}` : 'none',
                      borderRadius: i === 3 ? '12px' : 0,
                      flexDirection: isRTL ? 'row-reverse' : 'row',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: T.neutral50,
                        borderRadius: '12px',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '12px',
                        bgcolor: item.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'transform 0.2s ease',
                        '&:hover': { transform: 'scale(1.1)' },
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: { xs: 14, sm: 15 },
                        fontWeight: 600,
                        color: T.neutral700,
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

      {/* Bottom wave */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: { xs: 60, sm: 80 },
          background: `linear-gradient(to top, ${T.neutral50}, transparent)`,
        }}
      />
    </Box>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function StatsBar({ stats, isRTL }) {
  return (
    <Box
      sx={{
        bgcolor: T.white,
        py: { xs: 5, sm: 6, md: 8 },
        position: 'relative',
        zIndex: 2,
        mt: -2,
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={{ xs: 3, sm: 4, md: 6 }}
          justifyContent="center"
          direction={isRTL ? 'row-reverse' : 'row'}
        >
          {stats.map((stat, i) => (
            <Grid item xs={6} sm={3} key={i}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: '16px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: T.neutral50,
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 32px ${T.neutral100}`,
                  },
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    background: `linear-gradient(135deg, ${T.teal500} 0%, ${T.teal800} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1,
                    mb: 1,
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography
                  sx={{
                    color: T.neutral500,
                    fontWeight: 600,
                    fontSize: { xs: 13, sm: 14 },
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
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

// ─── Features ─────────────────────────────────────────────────────────────────

function Features({ features, isRTL, navigate, t }) {
  const icons = [
    { bg: T.teal50, color: T.teal500, shadow: `${T.teal400}22` },
    { bg: T.blueL, color: T.blue, shadow: `${T.blue}22` },
    { bg: T.amberL, color: T.amber, shadow: `${T.amber}22` },
  ];

  return (
    <Box sx={{ py: { xs: 8, sm: 10, md: 14 }, bgcolor: T.neutral50 }}>
      <Container maxWidth="lg">
        <SectionTitle isRTL={isRTL} subtitle={t('featuresSubtitle')}>
          {t('ourFeatures')}
        </SectionTitle>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
            flexWrap: { xs: 'nowrap', sm: 'wrap', md: 'nowrap' },
            gap: { xs: 3, sm: 3, md: 4 },
            justifyContent: 'center',
            alignItems: 'stretch',
          }}
        >
          {features.map((feature, i) => (
            <Box
              key={i}
              sx={{
                width: { 
                  xs: '100%',
                  sm: 'calc(50% - 12px)',
                  md: 'calc(33.333% - 21px)'
                },
                maxWidth: { md: 380 },
                display: 'flex',
              }}
            >
              <Card
                elevation={0}
                sx={{
                  width: '100%',
                  height: '100%',
                  minHeight: { xs: 300, sm: 320, md: 340 },
                  border: `1px solid ${T.neutral100}`,
                  borderRadius: { xs: '20px', sm: '24px' },
                  transition: 'all 0.4s ease',
                  overflow: 'visible',
                  position: 'relative',
                  '&:hover': {
                    borderColor: 'transparent',
                    transform: 'translateY(-12px)',
                    boxShadow: `0 24px 48px ${icons[i].shadow}`,
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: -1,
                    borderRadius: 'inherit',
                    padding: '1px',
                    background: `linear-gradient(135deg, ${icons[i].color}20, transparent)`,
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    opacity: 0,
                    transition: 'opacity 0.4s ease',
                  },
                  '&:hover::before': {
                    opacity: 1,
                  },
                }}
              >
                <CardContent sx={{ 
                  textAlign: 'center', 
                  p: { xs: 4, sm: 5 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Box
                    sx={{
                      width: { xs: 72, sm: 80 },
                      height: { xs: 72, sm: 80 },
                      borderRadius: '24px',
                      bgcolor: icons[i].bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1) rotate(5deg)',
                      },
                    }}
                  >
                    <Box sx={{ '& > svg': { fontSize: '36px !important', color: icons[i].color } }}>
                      {feature.icon}
                    </Box>
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: 18, sm: 20 },
                      color: T.neutral900,
                      mb: 1.5,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: T.neutral500,
                      fontSize: { xs: 14, sm: 15 },
                      lineHeight: 1.8,
                      maxWidth: 280,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        <Box sx={{ textAlign: 'center', mt: { xs: 6, sm: 8 } }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/doctors')}
            endIcon={<DirectionalArrow isRTL={isRTL} />}
            sx={{
              px: { xs: 5, sm: 6 },
              py: { xs: 1.5, sm: 1.75 },
              fontSize: { xs: '1rem', sm: '1.1rem' },
              fontWeight: 800,
              borderRadius: '14px',
              background: `linear-gradient(135deg, ${T.teal500} 0%, ${T.teal800} 100%)`,
              boxShadow: `0 8px 24px ${T.teal400}44`,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: `linear-gradient(135deg, ${T.teal600} 0%, ${T.teal900} 100%)`,
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 32px ${T.teal400}66`,
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

// ─── How It Works ─────────────────────────────────────────────────────────────

function HowItWorks({ steps, isRTL, t }) {
  return (
    <Box
      sx={{
        bgcolor: T.white,
        py: { xs: 8, sm: 10, md: 14 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: 300, sm: 500, md: 700 },
          height: { xs: 300, sm: 500, md: 700 },
          borderRadius: '50%',
          background: `radial-gradient(circle, ${T.teal50} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <SectionTitle isRTL={isRTL}>{t('howItWorks')}</SectionTitle>

        {/* ← ← ← Box بدل Grid للتحكم الكامل */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
            flexWrap: { xs: 'nowrap', sm: 'wrap', md: 'nowrap' },
            gap: { xs: 4, sm: 3, md: 4 },
            justifyContent: 'center',
            alignItems: 'stretch',
          }}
        >
          {steps.map((item, i) => (
            <Box
              key={i}
              sx={{
                width: { 
                  xs: '100%',                    // ← موبايل: كامل
                  sm: 'calc(50% - 12px)',        // ← تابلت: نصف (2 في الصف)
                  md: 'calc(25% - 24px)'         // ← لابتوب: ربع (4 في الصف - سطر واحد)
                },
                maxWidth: { md: 280 },
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  textAlign: 'center',
                  position: 'relative',
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  p: { xs: 2, sm: 2.5, md: 3 },
                  borderRadius: '20px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: T.teal50,
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                {/* Step number */}
                <Box
                  sx={{
                    width: { xs: 80, sm: 88, md: 96 },
                    height: { xs: 80, sm: 88, md: 96 },
                    borderRadius: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: { xs: 2.5, sm: 3 },
                    background: `linear-gradient(135deg, ${T.teal400} 0%, ${T.teal600} 100%)`,
                    color: T.white,
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    fontWeight: 900,
                    boxShadow: `0 12px 32px ${T.teal400}44`,
                    transition: 'all 0.3s ease',
                    flexShrink: 0,
                    '&:hover': {
                      transform: 'scale(1.1) rotate(-5deg)',
                      boxShadow: `0 16px 40px ${T.teal400}66`,
                    },
                  }}
                >
                  {item.step}
                </Box>

                {/* Connector line (hidden on mobile, visible on md+) */}
                {i < 3 && (
                  <Box
                    sx={{
                      display: { xs: 'none', sm: 'none', md: 'block' },
                      position: 'absolute',
                      top: 48,
                      [isRTL ? 'left' : 'right']: -24,
                      width: 48,
                      height: 2,
                      background: `linear-gradient(90deg, ${T.teal200}, ${T.teal400})`,
                      zIndex: -1,
                    }}
                  />
                )}

                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: 16, sm: 18, md: 20 },
                    color: T.neutral900,
                    mb: 1,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    color: T.neutral500,
                    fontSize: { xs: 14, sm: 15 },
                    lineHeight: 1.7,
                    maxWidth: 220,
                    mx: 'auto',
                  }}
                >
                  {item.desc}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

// ─── CTA Cards ────────────────────────────────────────────────────────────────

function PatientCTA({ currentUser, isRTL, navigate, t }) {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8, md: 10 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, sm: 6, md: 8 },
          textAlign: 'center',
          borderRadius: { xs: '24px', sm: '32px' },
          background: `linear-gradient(135deg, ${T.teal50} 0%, #F0FAF6 50%, ${T.blueL} 100%)`,
          border: `1px solid ${T.teal100}`,
          position: 'relative',
          overflow: 'hidden',
          direction: isRTL ? 'rtl' : 'ltr',
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
            background: `radial-gradient(circle, ${T.teal200}30, transparent)`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${T.blue}15, transparent)`,
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              width: { xs: 80, sm: 96 },
              height: { xs: 80, sm: 96 },
              borderRadius: '24px',
              background: `linear-gradient(135deg, ${T.teal400} 0%, ${T.teal600} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: `0 12px 32px ${T.teal400}44`,
            }}
          >
            <People sx={{ fontSize: { xs: 36, sm: 44 }, color: T.white }} />
          </Box>
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
              color: T.neutral900,
              mb: 1.5,
            }}
          >
            {t('welcome')}, {currentUser.displayName}! 👋
          </Typography>
          <Typography
            sx={{
              color: T.neutral500,
              mb: 4,
              fontSize: { xs: 15, sm: 17 },
              lineHeight: 1.7,
              maxWidth: 480,
              mx: 'auto',
            }}
          >
            {t('patientWelcomeMessage')}
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 2, sm: 2.5 }}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/doctors')}
              endIcon={<DirectionalArrow isRTL={isRTL} />}
              sx={{
                borderRadius: '14px',
                background: `linear-gradient(135deg, ${T.teal500} 0%, ${T.teal800} 100%)`,
                boxShadow: `0 8px 24px ${T.teal400}44`,
                fontWeight: 800,
                px: { xs: 4, sm: 5 },
                py: { xs: 1.25, sm: 1.5 },
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 12px 32px ${T.teal400}66`,
                },
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
                borderRadius: '14px',
                border: `2px solid ${T.teal200}`,
                color: T.teal700,
                fontWeight: 700,
                px: { xs: 4, sm: 5 },
                py: { xs: 1.25, sm: 1.5 },
                transition: 'all 0.3s ease',
                '&:hover': {
                  border: `2px solid ${T.teal400}`,
                  bgcolor: T.teal50,
                  transform: 'translateY(-4px)',
                },
              }}
            >
              {t('myAppointments')}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}

function DoctorCTA({ currentUser, isRTL, navigate, t }) {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8, md: 10 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, sm: 6, md: 8 },
          textAlign: 'center',
          borderRadius: { xs: '24px', sm: '32px' },
          background: `linear-gradient(135deg, ${T.teal50} 0%, #F0FAF6 100%)`,
          border: `1px solid ${T.teal100}`,
          position: 'relative',
          overflow: 'hidden',
          direction: isRTL ? 'rtl' : 'ltr',
        }}
      >
        <Box
          sx={{
            width: { xs: 80, sm: 96 },
            height: { xs: 80, sm: 96 },
            borderRadius: '24px',
            background: `linear-gradient(135deg, ${T.teal500} 0%, ${T.teal800} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            boxShadow: `0 12px 32px ${T.teal400}44`,
          }}
        >
          <LocalHospital sx={{ fontSize: { xs: 36, sm: 44 }, color: T.white }} />
        </Box>
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
            color: T.neutral900,
            mb: 1.5,
          }}
        >
          {t('welcome')}, Dr. {currentUser.displayName}! 👨‍⚕️
        </Typography>
        <Typography
          sx={{
            color: T.neutral500,
            mb: 4,
            fontSize: { xs: 15, sm: 17 },
            lineHeight: 1.7,
            maxWidth: 480,
            mx: 'auto',
          }}
        >
          {t('doctorWelcomeMessage')}
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/doctor-dashboard')}
          endIcon={<DirectionalArrow isRTL={isRTL} />}
          sx={{
            borderRadius: '14px',
            px: { xs: 5, sm: 6 },
            py: { xs: 1.25, sm: 1.5 },
            fontWeight: 800,
            background: `linear-gradient(135deg, ${T.teal500} 0%, ${T.teal800} 100%)`,
            boxShadow: `0 8px 24px ${T.teal400}44`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 12px 32px ${T.teal400}66`,
            },
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
    <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8, md: 10 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, sm: 6, md: 8 },
          textAlign: 'center',
          borderRadius: { xs: '24px', sm: '32px' },
          background: `linear-gradient(135deg, ${T.neutral50} 0%, ${T.white} 50%, ${T.teal50} 100%)`,
          border: `1px solid ${T.neutral100}`,
          position: 'relative',
          overflow: 'hidden',
          direction: isRTL ? 'rtl' : 'ltr',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${T.teal200}25, transparent)`,
          }}
        />

        <Typography
          sx={{
            fontWeight: 900,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
            color: T.neutral900,
            mb: 1.5,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {t('joinCommunity')}
        </Typography>
        <Typography
          sx={{
            color: T.neutral500,
            mb: 4,
            fontSize: { xs: 15, sm: 17 },
            lineHeight: 1.7,
            maxWidth: 480,
            mx: 'auto',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {t('joinMessage')}
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 2.5 }}
          justifyContent="center"
          sx={{ position: 'relative', zIndex: 1 }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/signup')}
            endIcon={<DirectionalArrow isRTL={isRTL} />}
            sx={{
              borderRadius: '14px',
              px: { xs: 5, sm: 6 },
              py: { xs: 1.25, sm: 1.5 },
              fontWeight: 800,
              background: `linear-gradient(135deg, ${T.teal500} 0%, ${T.teal800} 100%)`,
              boxShadow: `0 8px 24px ${T.teal400}44`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 32px ${T.teal400}66`,
              },
            }}
          >
            {t('signup')}
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/login')}
            sx={{
              borderRadius: '14px',
              px: { xs: 5, sm: 6 },
              py: { xs: 1.25, sm: 1.5 },
              fontWeight: 700,
              border: `2px solid ${T.neutral200}`,
              color: T.neutral600,
              transition: 'all 0.3s ease',
              '&:hover': {
                border: `2px solid ${T.teal400}`,
                color: T.teal600,
                bgcolor: T.teal50,
                transform: 'translateY(-4px)',
              },
            }}
          >
            {t('login')}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ isRTL, navigate, t }) {
  const links = [
    { text: t('home'), path: '/' },
    { text: t('doctors'), path: '/doctors' },
    { text: t('signup'), path: '/signup' },
    { text: t('login'), path: '/login' },
  ];

  return (
    <Box
      sx={{
        bgcolor: T.neutral900,
        color: T.white,
        pt: { xs: 8, sm: 10, md: 12 },
        pb: { xs: 4, sm: 5 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top gradient line */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${T.teal400}, ${T.teal600}, ${T.blue})`,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid
          container
          spacing={{ xs: 6, sm: 8 }}
          direction={isRTL ? 'row-reverse' : 'row'}
        >
          {/* Brand */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 3,
                flexDirection: isRTL ? 'row-reverse' : 'row',
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${T.teal400} 0%, ${T.teal600} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MedicalServices sx={{ fontSize: 24, color: T.white }} />
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: 20, color: T.white }}>
                {t('appName')}
              </Typography>
            </Box>
            <Typography
              sx={{
                color: T.neutral400,
                fontSize: 14,
                lineHeight: 1.8,
                mb: 3,
                maxWidth: 280,
              }}
            >
              {t('footerDescription')}
            </Typography>
            <Stack spacing={1.5}>
              {[
                { icon: <Email sx={{ fontSize: 16 }} />, text: 'support@tabibak.com' },
                { icon: <Phone sx={{ fontSize: 16 }} />, text: '+20 123 456 7890' },
                { icon: <LocationOn sx={{ fontSize: 16 }} />, text: 'Cairo, Egypt' },
              ].map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    color: T.neutral400,
                    fontSize: 13,
                  }}
                >
                  {item.icon}
                  {item.text}
                </Box>
              ))}
            </Stack>
          </Grid>

          {/* Quick links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 16,
                mb: 3,
                color: T.white,
              }}
            >
              {t('quickLinks')}
            </Typography>
            <Stack spacing={2}>
              {links.map((link) => (
                <Button
                  key={link.path}
                  color="inherit"
                  onClick={() => navigate(link.path)}
                  sx={{
                    color: T.neutral400,
                    fontWeight: 500,
                    fontSize: 14,
                    justifyContent: isRTL ? 'flex-end' : 'flex-start',
                    minWidth: 0,
                    px: 0,
                    py: 0.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: T.teal400,
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  {link.text}
                </Button>
              ))}
            </Stack>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 16,
                mb: 3,
                color: T.white,
              }}
            >
              {t('stayUpdated') || 'Stay Updated'}
            </Typography>
            <Typography
              sx={{
                color: T.neutral400,
                fontSize: 14,
                lineHeight: 1.7,
                mb: 3,
              }}
            >
              {t('newsletterDesc') || 'Subscribe to get the latest health tips and updates.'}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Box
                component="input"
                placeholder={t('yourEmail') || 'Your email'}
                sx={{
                  flex: 1,
                  bgcolor: T.neutral800,
                  border: `1px solid ${T.neutral700}`,
                  borderRadius: '10px',
                  px: 2,
                  py: 1.25,
                  color: T.white,
                  fontSize: 14,
                  outline: 'none',
                  '&::placeholder': { color: T.neutral500 },
                  '&:focus': { borderColor: T.teal400 },
                }}
              />
              <Button
                variant="contained"
                sx={{
                  bgcolor: T.teal500,
                  borderRadius: '10px',
                  px: 3,
                  fontWeight: 700,
                  '&:hover': { bgcolor: T.teal600 },
                }}
              >
                {t('subscribe') || 'Subscribe'}
              </Button>
            </Stack>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            borderTop: `1px solid ${T.neutral800}`,
            mt: { xs: 6, sm: 8 },
            pt: 4,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography sx={{ color: T.neutral500, fontSize: 13 }}>
            © 2024 {t('appName')}. {t('allRightsReserved')}
          </Typography>
          <Stack direction="row" spacing={3}>
            {['Privacy', 'Terms', 'Cookies'].map((text) => (
              <Typography
                key={text}
                sx={{
                  color: T.neutral500,
                  fontSize: 13,
                  cursor: 'pointer',
                  '&:hover': { color: T.teal400 },
                }}
              >
                {text}
              </Typography>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

// ─── Home (main) ──────────────────────────────────────────────────────────────

export default function Home() {
  const { currentUser, userRole } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === 'ar';

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
    { number: '50K+', label: t('patients') },
    { number: '100K+', label: t('appointments') },
    { number: '4.8★', label: t('rating') },
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