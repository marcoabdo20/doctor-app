import { useState } from 'react';
import { useDoctors, useDoctorsBySpecialty } from '../hooks/useDoctors';
import { useLanguage } from '../context/LanguageContext';
import DoctorCard from '../components/DoctorCard';
import {
  Container, Typography, Grid, Box, TextField, InputAdornment,
  CircularProgress, Alert, Fade, Paper, Chip,
} from '@mui/material';
import {
  Search,
  MedicalServices, Visibility, ChildCare,
  LocalHospital, Healing, Biotech, GridView,
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
};

// ─── Specialties ──────────────────────────────────────────────────────────────

const SPECIALTIES = [
  { en: 'All',              ar: 'الكل',       icon: <GridView        sx={{ fontSize: 14 }} /> },
  { en: 'Cardiology',       ar: 'قلب وأوعية', icon: <Healing         sx={{ fontSize: 14 }} /> },
  { en: 'Dermatology',      ar: 'جلدية',       icon: <Biotech         sx={{ fontSize: 14 }} /> },
  { en: 'Orthopedics',      ar: 'عظام',        icon: <MedicalServices sx={{ fontSize: 14 }} /> },
  { en: 'Dentistry',        ar: 'أسنان',       icon: <LocalHospital   sx={{ fontSize: 14 }} /> },
  { en: 'Pediatrics',       ar: 'أطفال',       icon: <ChildCare       sx={{ fontSize: 14 }} /> },
  { en: 'Ophthalmology',    ar: 'عيون',        icon: <Visibility      sx={{ fontSize: 14 }} /> },
  { en: 'General Medicine', ar: 'طب عام',      icon: <MedicalServices sx={{ fontSize: 14 }} /> },
];

// ─── HeroBanner ───────────────────────────────────────────────────────────────

function HeroBanner({ isRTL }) {
  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: { xs: '16px', md: '20px' },
        border: `1px solid ${T.teal100}`,
        background: `linear-gradient(135deg, ${T.teal50} 0%, #F0FAF6 50%, #E8F5F0 100%)`,
        p: { xs: '28px 20px', sm: '44px 40px', md: '56px 60px' },
        mb: { xs: 3, md: 4 },
        textAlign: 'center',
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      {/* Decorative blobs */}
      <Box sx={{
        position: 'absolute', top: -70, left: -70,
        width: 200, height: 200, borderRadius: '50%',
        background: `${T.teal400}18`, pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', bottom: -50, right: -50,
        width: 160, height: 160, borderRadius: '50%',
        background: `${T.teal600}12`, pointerEvents: 'none',
      }} />

      {/* Badge */}
      <Box
        component="span"
        sx={{
          display: 'inline-flex', alignItems: 'center', gap: 0.75,
          bgcolor: '#fff', color: T.teal600,
          fontSize: { xs: 11, sm: 12 }, fontWeight: 700,
          px: 2, py: 0.75, borderRadius: 100,
          border: `1px solid ${T.teal100}`,
          mb: { xs: 2, sm: 2.5 },
          boxShadow: '0 1px 6px rgba(15,110,86,0.10)',
          position: 'relative', zIndex: 1,
        }}
      >
        <MedicalServices sx={{ fontSize: 13 }} />
        {isRTL ? 'رعاية صحية متكاملة' : 'Complete Healthcare'}
      </Box>

      {/* Headline */}
      <Typography
        component="h1"
        sx={{
          fontWeight: 800,
          fontSize: { xs: '1.5rem', sm: '2.25rem', md: '2.75rem' },
          lineHeight: { xs: 1.25, sm: 1.2 },
          color: T.teal800,
          mb: { xs: 1.25, sm: 1.5 },
          position: 'relative', zIndex: 1,
        }}
      >
        {isRTL ? (
          <>ابحث عن طبيبك{' '}
            <Box component="span" sx={{ color: T.teal400 }}>المثالي</Box>
          </>
        ) : (
          <>Find Your{' '}
            <Box component="span" sx={{ color: T.teal400 }}>Perfect Doctor</Box>
          </>
        )}
      </Typography>

      {/* Subline */}
      <Typography
        sx={{
          color: T.neutral600,
          fontSize: { xs: 13, sm: 15 },
          maxWidth: 480, mx: 'auto',
          lineHeight: 1.65,
          position: 'relative', zIndex: 1,
        }}
      >
        {isRTL
          ? 'احجز موعدك مع أفضل الأطباء بسهولة وسرعة'
          : 'Book your appointment with the best doctors, quickly and easily'}
      </Typography>
    </Paper>
  );
}

// ─── StatsBar ─────────────────────────────────────────────────────────────────

function StatsBar({ total, isRTL }) {
  const stats = [
    { value: total,  label: isRTL ? 'طبيب متاح'   : 'Doctors'     },
    { value: 8,      label: isRTL ? 'تخصص طبي'    : 'Specialties' },
    { value: '24/7', label: isRTL ? 'خدمة مستمرة' : 'Support'     },
  ];

  return (
    <Grid
      container
      spacing={{ xs: 1.5, sm: 2 }}
      sx={{ mb: { xs: 2.5, md: 3 }, direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {stats.map((s) => (
        <Grid item xs={4} key={s.label}>
          <Paper
            elevation={0}
            sx={{
              textAlign: 'center',
              py: { xs: 1.75, sm: 2.5 },
              px: 1,
              border: `1px solid ${T.neutral100}`,
              borderRadius: { xs: '12px', sm: '14px' },
              bgcolor: T.neutral50,
              transition: 'border-color .2s',
              '&:hover': { borderColor: T.teal100 },
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.6rem' },
                fontWeight: 800,
                color: T.teal400,
                lineHeight: 1.1,
              }}
            >
              {s.value}
            </Typography>
            <Typography
              sx={{ fontSize: { xs: 10, sm: 12 }, color: T.neutral600, mt: 0.5, fontWeight: 500 }}
            >
              {s.label}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

// ─── SearchPanel ──────────────────────────────────────────────────────────────

function SearchPanel({ searchTerm, setSearchTerm, selectedSpecialty, setSelectedSpecialty, isRTL }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: '16px', sm: '20px 24px' },
        mb: { xs: 2.5, md: 3 },
        borderRadius: { xs: '14px', sm: '16px' },
        border: `1px solid ${T.neutral100}`,
        bgcolor: '#fff',
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: 12, sm: 13 },
          color: T.neutral600,
          fontWeight: 600,
          mb: 1.5,
          letterSpacing: '0.03em',
        }}
      >
        {isRTL ? 'البحث والتصفية' : 'Search & Filter'}
      </Typography>

      {/* Search field */}
      <TextField
        fullWidth
        placeholder={
          isRTL
            ? 'ابحث بالاسم أو التخصص أو الموقع...'
            : 'Search by name, specialty, or location...'
        }
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        variant="outlined"
        size="small"
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            fontSize: { xs: 13, sm: 14 },
            bgcolor: T.neutral50,
            direction: isRTL ? 'rtl' : 'ltr',
            '& fieldset': { borderColor: T.neutral100 },
            '&:hover fieldset': { borderColor: T.teal400 },
            '&.Mui-focused fieldset': { borderColor: T.teal400, borderWidth: '1.5px' },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position={isRTL ? 'end' : 'start'}>
              <Search sx={{ color: T.neutral600, fontSize: { xs: 18, sm: 20 } }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Specialty chips */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: { xs: 'nowrap', sm: 'wrap' },
          overflowX: { xs: 'auto', sm: 'visible' },
          gap: { xs: 0.75, sm: 1 },
          pb: { xs: 0.5, sm: 0 },
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
        {SPECIALTIES.map((s) => {
          const active = selectedSpecialty === s.en;
          return (
            <Chip
              key={s.en}
              icon={s.icon}
              label={isRTL ? s.ar : s.en}
              onClick={() => setSelectedSpecialty(s.en)}
              size="small"
              sx={{
                flexShrink: 0,
                fontSize: { xs: 11, sm: 12 },
                fontWeight: 600,
                borderRadius: 100,
                height: { xs: 32, sm: 34 },
                bgcolor: active ? T.teal400 : T.neutral50,
                color:   active ? '#fff'    : T.neutral600,
                border: `1.5px solid ${active ? T.teal400 : T.neutral100}`,
                transition: 'all .18s',
                '& .MuiChip-icon': {
                  color: active ? 'rgba(255,255,255,0.9)' : T.teal400,
                },
                '& .MuiChip-label': { px: { xs: 1, sm: 1.25 } },
                '&:hover': {
                  bgcolor:     active ? T.teal600 : T.teal50,
                  borderColor: T.teal400,
                  color:       active ? '#fff'    : T.teal600,
                },
              }}
            />
          );
        })}
      </Box>
    </Paper>
  );
}

// ─── Results Header ───────────────────────────────────────────────────────────

function ResultsHeader({ count, isRTL }) {
  return (
    <Box
      sx={{
        mb: { xs: 1.5, sm: 2 },
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      <Typography sx={{ fontSize: { xs: 12.5, sm: 13 }, color: T.neutral600 }}>
        {isRTL ? (
          <>
            <Box component="span" sx={{ color: T.teal400, fontWeight: 700 }}>{count}</Box>
            {' '}طبيب متاح
          </>
        ) : (
          <>
            <Box component="span" sx={{ color: T.teal400, fontWeight: 700 }}>{count}</Box>
            {' '}doctors found
          </>
        )}
      </Typography>
    </Box>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ isRTL }) {
  return (
    <Box sx={{ textAlign: 'center', py: { xs: 7, md: 10 }, direction: isRTL ? 'rtl' : 'ltr' }}>
      <Box
        sx={{
          width: { xs: 64, sm: 80 },
          height: { xs: 64, sm: 80 },
          bgcolor: T.teal50,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2,
        }}
      >
        <MedicalServices sx={{ fontSize: { xs: 30, sm: 36 }, color: T.teal400 }} />
      </Box>
      <Typography sx={{ fontSize: { xs: 14, sm: 16 }, fontWeight: 700, color: 'text.primary', mb: 0.75 }}>
        {isRTL ? 'لا يوجد أطباء' : 'No doctors found'}
      </Typography>
      <Typography sx={{ fontSize: { xs: 12.5, sm: 13.5 }, color: T.neutral600 }}>
        {isRTL ? 'جرّب تغيير الفلتر أو البحث' : 'Try adjusting your search or filter'}
      </Typography>
    </Box>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DoctorsList() {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [searchTerm, setSearchTerm]               = useState('');

  const { doctors: allDoctors,      loading: allLoading,      error } = useDoctors();
  const { doctors: filteredDoctors, loading: filteredLoading }        =
    useDoctorsBySpecialty(selectedSpecialty !== 'All' ? selectedSpecialty : null);

  const doctors = selectedSpecialty === 'All' ? allDoctors : filteredDoctors;
  const loading = selectedSpecialty === 'All' ? allLoading : filteredLoading;

  // No availability filter here — the card itself only shows the pill when available
  const displayedDoctors = doctors.filter((d) => {
    const q = searchTerm.toLowerCase();
    return (
      d.name?.toLowerCase().includes(q) ||
      d.specialty?.toLowerCase().includes(q) ||
      d.location?.toLowerCase().includes(q)
    );
  });

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 14 }}>
        <CircularProgress sx={{ color: T.teal400 }} size={40} thickness={4} />
      </Box>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: '12px' }}>
          {t('error')}: {error}
        </Alert>
      </Container>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <Container
      maxWidth="lg"
      sx={{ py: { xs: 2.5, sm: 3.5, md: 5 }, px: { xs: 2, sm: 3, md: 4 } }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <Fade in timeout={400}>
        <Box>
          <HeroBanner isRTL={isRTL} />
          <StatsBar total={displayedDoctors.length} isRTL={isRTL} />
          <SearchPanel
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedSpecialty={selectedSpecialty}
            setSelectedSpecialty={setSelectedSpecialty}
            isRTL={isRTL}
          />
          <ResultsHeader count={displayedDoctors.length} isRTL={isRTL} />

          {/* Cards grid — equal height rows via alignItems stretch (default) */}
          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            {displayedDoctors.map((doctor, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={doctor.id}
                sx={{
                  display: 'flex',          // makes the Grid cell a flex container
                }}
              >
                <Fade in timeout={300 + index * 60}>
                  {/* This Box fills the flex cell so the Paper inside stretches */}
                  <Box sx={{ width: '100%', display: 'flex' }}>
                    <DoctorCard doctor={doctor} />
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>

          {displayedDoctors.length === 0 && <EmptyState isRTL={isRTL} />}
        </Box>
      </Fade>
    </Container>
  );
}