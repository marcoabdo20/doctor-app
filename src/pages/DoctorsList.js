import { useState } from 'react';
import { useDoctors, useDoctorsBySpecialty } from '../hooks/useDoctors';
import { useLanguage } from '../context/LanguageContext';
import DoctorCard from '../components/DoctorCard';
import {
  Container, Typography, Box, TextField, InputAdornment,
  CircularProgress, Alert, Fade, Paper, Chip,
} from '@mui/material';
import {
  Search, MedicalServices, Visibility, ChildCare,
  LocalHospital, Healing, Biotech, GridView,
} from '@mui/icons-material';

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  primary: '#0f4c81',
  primaryMid: '#1a6aad',
  primaryLt: '#e8f0fb',
  accent: '#1a7a5e',
  accentLt: '#e6f4ef',
  neutral50: '#f8fafc',
  neutral100: '#eef1f6',
  neutral400: '#94a3b8',
  neutral600: '#64748b',
  neutral800: '#1e293b',
  white: '#ffffff',
};

// ─── Specialties ──────────────────────────────────────────────────────────────
const SPECIALTIES = [
  { en: 'All', ar: 'الكل', icon: <GridView sx={{ fontSize: 13 }} /> },
  { en: 'Cardiology', ar: 'قلب', icon: <Healing sx={{ fontSize: 13 }} /> },
  { en: 'Dermatology', ar: 'جلدية', icon: <Biotech sx={{ fontSize: 13 }} /> },
  { en: 'Orthopedics', ar: 'عظام', icon: <MedicalServices sx={{ fontSize: 13 }} /> },
  { en: 'Dentistry', ar: 'أسنان', icon: <LocalHospital sx={{ fontSize: 13 }} /> },
  { en: 'Pediatrics', ar: 'أطفال', icon: <ChildCare sx={{ fontSize: 13 }} /> },
  { en: 'Ophthalmology', ar: 'عيون', icon: <Visibility sx={{ fontSize: 13 }} /> },
  { en: 'General Medicine', ar: 'طب عام', icon: <MedicalServices sx={{ fontSize: 13 }} /> },
];

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroBanner({ isRTL }) {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: { xs: 3, md: 4 },
        background: `linear-gradient(135deg, ${C.primary} 0%, #0d3b6e 40%, ${C.accent} 100%)`,
        p: { xs: '32px 20px', sm: '48px 44px', md: '60px 64px' },
        mb: { xs: 3, md: 4 },
        textAlign: 'center',
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      {[
        { w: 300, h: 300, top: -80, left: -80, op: 0.06 },
        { w: 200, h: 200, bottom: -60, right: -60, op: 0.08 },
        { w: 120, h: 120, top: '30%', left: '15%', op: 0.04 },
        { w: 80, h: 80, bottom: '20%', right: '20%', op: 0.06 },
      ].map((b, i) => (
        <Box key={i} sx={{
          position: 'absolute', pointerEvents: 'none',
          width: b.w, height: b.h, borderRadius: '50%',
          background: '#fff', opacity: b.op,
          top: b.top, bottom: b.bottom,
          left: b.left, right: b.right,
        }} />
      ))}

      <Box component="span" sx={{
        display: 'inline-flex', alignItems: 'center', gap: 0.75,
        bgcolor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
        color: '#fff', fontSize: { xs: 11, sm: 12 }, fontWeight: 700,
        px: 2, py: 0.75, borderRadius: 100,
        border: '1px solid rgba(255,255,255,0.2)',
        mb: { xs: 2, sm: 2.5 }, position: 'relative', zIndex: 1,
        letterSpacing: '0.04em',
      }}>
        <MedicalServices sx={{ fontSize: 13 }} />
        {isRTL ? 'رعاية صحية متكاملة' : 'Complete Healthcare'}
      </Box>

      <Typography component="h1" sx={{
        fontWeight: 800,
        fontSize: { xs: '1.65rem', sm: '2.4rem', md: '3rem' },
        lineHeight: 1.15,
        color: '#fff',
        mb: { xs: 1.5, sm: 2 },
        position: 'relative', zIndex: 1,
        letterSpacing: { xs: '-0.02em', md: '-0.03em' },
      }}>
        {isRTL ? (
          <>ابحث عن طبيبك{' '}
            <Box component="span" sx={{
              color: 'transparent',
              background: 'linear-gradient(90deg, #7dd3c0, #a3e4d7)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>المثالي</Box>
          </>
        ) : (
          <>Find Your{' '}
            <Box component="span" sx={{
              color: 'transparent',
              background: 'linear-gradient(90deg, #7dd3c0, #a3e4d7)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Perfect Doctor</Box>
          </>
        )}
      </Typography>

      <Typography sx={{
        color: 'rgba(255,255,255,0.72)',
        fontSize: { xs: 13, sm: 15.5 },
        maxWidth: 500, mx: 'auto',
        lineHeight: 1.7,
        position: 'relative', zIndex: 1,
      }}>
        {isRTL
          ? 'احجز موعدك مع أفضل الأطباء بسهولة وسرعة'
          : 'Book your appointment with the best doctors, quickly and easily'}
      </Typography>

      <Box sx={{
        display: 'flex', justifyContent: 'center', gap: { xs: 3, sm: 5 },
        mt: { xs: 3, sm: 4 }, position: 'relative', zIndex: 1,
      }}>
        {[
          { v: '8+', l: isRTL ? 'تخصص' : 'Specialties' },
          { v: '24/7', l: isRTL ? 'دعم' : 'Support' },
          { v: '100%', l: isRTL ? 'أمان' : 'Secure' },
        ].map((s) => (
          <Box key={s.l} sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: { xs: '1.1rem', sm: '1.4rem' }, lineHeight: 1 }}>
              {s.v}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: { xs: 10, sm: 12 }, mt: 0.4, fontWeight: 500 }}>
              {s.l}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ─── Search Panel ─────────────────────────────────────────────────────────────
function SearchPanel({ searchTerm, setSearchTerm, selectedSpecialty, setSelectedSpecialty, isRTL }) {
  return (
    <Paper elevation={0} sx={{
      p: { xs: '16px', sm: '20px 24px' },
      mb: { xs: 2.5, md: 3 },
      borderRadius: 3,
      border: `1px solid ${C.neutral100}`,
      bgcolor: C.white,
      direction: isRTL ? 'rtl' : 'ltr',
    }}>
      <TextField
        fullWidth
        placeholder={isRTL ? 'ابحث بالاسم أو التخصص أو الموقع...' : 'Search by name, specialty, or location...'}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        variant="outlined"
        size="small"
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            fontSize: { xs: 13, sm: 14 },
            bgcolor: C.neutral50,
            direction: isRTL ? 'rtl' : 'ltr',
            '& fieldset': { borderColor: C.neutral100 },
            '&:hover fieldset': { borderColor: C.primary },
            '&.Mui-focused fieldset': { borderColor: C.primary, borderWidth: '1.5px' },
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position={isRTL ? 'end' : 'start'}>
                <Search sx={{ color: C.neutral400, fontSize: { xs: 18, sm: 20 } }} />
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Specialty chips — custom Box for better RTL/LTR control */}
      <Box sx={{
        display: 'flex',
        flexWrap: { xs: 'nowrap', sm: 'wrap' },
        overflowX: { xs: 'auto', sm: 'visible' },
        gap: { xs: 0.75, sm: 1 },
        pb: { xs: 0.5, sm: 0 },
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}>
        {SPECIALTIES.map((s) => {
          const active = selectedSpecialty === s.en;
          return (
            <Box
              key={s.en}
              onClick={() => setSelectedSpecialty(s.en)}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',                    // ← مسافة بين الأيقونة والنص
                flexDirection: isRTL ? 'row-reverse' : 'row',  // ← ← ← حسب اللغة
                px: { xs: '10px', sm: '12px' },
                py: { xs: '6px', sm: '7px' },
                borderRadius: 100,
                fontSize: { xs: 11, sm: 12 },
                fontWeight: 600,
                cursor: 'pointer',
                flexShrink: 0,
                userSelect: 'none',
                bgcolor: active ? C.primary : C.neutral50,
                color: active ? '#fff' : C.neutral600,
                border: `1.5px solid ${active ? C.primary : C.neutral100}`,
                transition: 'all .18s ease',
                '&:hover': {
                  bgcolor: active ? '#0d3b6e' : C.primaryLt,
                  borderColor: C.primary,
                  color: active ? '#fff' : C.primary,
                  transform: 'translateY(-1px)',
                  boxShadow: active ? '0 4px 12px rgba(15,76,129,0.3)' : 'none',
                },
              }}
            >
              {/* الأيقونة */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                color: active ? 'rgba(255,255,255,0.9)' : C.primary,
                fontSize: { xs: 13, sm: 14 },
              }}>
                {s.icon}
              </Box>

              {/* النص */}
              <Box component="span">
                {isRTL ? s.ar : s.en}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}

// ─── Results header ───────────────────────────────────────────────────────────
function ResultsHeader({ count, isRTL }) {
  return (
    <Box sx={{ mb: { xs: 1.5, sm: 2 }, direction: isRTL ? 'rtl' : 'ltr' }}>
      <Typography sx={{ fontSize: { xs: 12.5, sm: 13 }, color: C.neutral600 }}>
        {isRTL ? (
          <><Box component="span" sx={{ color: C.primary, fontWeight: 700 }}>{count}</Box>{' '}طبيب متاح</>
        ) : (
          <><Box component="span" sx={{ color: C.primary, fontWeight: 700 }}>{count}</Box>{' '}doctor{count !== 1 ? 's' : ''} found</>
        )}
      </Typography>
    </Box>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ isRTL }) {
  return (
    <Box sx={{ textAlign: 'center', py: { xs: 7, md: 10 }, direction: isRTL ? 'rtl' : 'ltr' }}>
      <Box sx={{
        width: { xs: 72, sm: 88 }, height: { xs: 72, sm: 88 },
        background: `linear-gradient(135deg, ${C.primaryLt}, ${C.accentLt})`,
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        mx: 'auto', mb: 2.5,
        boxShadow: '0 8px 24px rgba(15,76,129,0.1)',
      }}>
        <MedicalServices sx={{ fontSize: { xs: 34, sm: 40 }, color: C.primary }} />
      </Box>
      <Typography sx={{ fontSize: { xs: 15, sm: 17 }, fontWeight: 700, color: C.neutral800, mb: 0.75 }}>
        {isRTL ? 'لا يوجد أطباء' : 'No doctors found'}
      </Typography>
      <Typography sx={{ fontSize: { xs: 12.5, sm: 14 }, color: C.neutral600 }}>
        {isRTL ? 'جرّب تغيير الفلتر أو كلمة البحث' : 'Try adjusting your search or filter'}
      </Typography>
    </Box>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DoctorsList() {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const { doctors: allDoctors, loading: allLoading, error } = useDoctors();
  const { doctors: filteredDoctors, loading: filteredLoading } =
    useDoctorsBySpecialty(selectedSpecialty !== 'All' ? selectedSpecialty : null);

  const doctors = selectedSpecialty === 'All' ? allDoctors : filteredDoctors;
  const loading = selectedSpecialty === 'All' ? allLoading : filteredLoading;

  const displayedDoctors = doctors.filter((d) => {
    const q = searchTerm.toLowerCase();
    return (
      d.name?.toLowerCase().includes(q) ||
      d.specialty?.toLowerCase().includes(q) ||
      d.location?.toLowerCase().includes(q)
    );
  });

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <CircularProgress sx={{ color: C.primary }} size={44} thickness={3.5} />
    </Box>
  );

  if (error) return (
    <Container sx={{ py: 4 }}>
      <Alert severity="error" sx={{ borderRadius: 2 }}>{t('error')}: {error}</Alert>
    </Container>
  );

  return (
    <Box
      dir={isRTL ? 'rtl' : 'ltr'}
      sx={{ bgcolor: C.neutral50, minHeight: '100vh', pb: { xs: 5, md: 8 } }}
    >
      <Container maxWidth="lg" sx={{ pt: { xs: 2.5, sm: 3.5, md: 5 }, px: { xs: 2, sm: 3 } }}>
        <Fade in timeout={400}>
          <Box>
            <HeroBanner isRTL={isRTL} />

            <SearchPanel
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedSpecialty={selectedSpecialty}
              setSelectedSpecialty={setSelectedSpecialty}
              isRTL={isRTL}
            />

            <ResultsHeader count={displayedDoctors.length} isRTL={isRTL} />

            {/* ── Cards Grid ─────────────────────────────────────────────── */}
            {displayedDoctors.length > 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: { xs: 2, sm: 2.5, md: 3 },
                }}
              >
                {displayedDoctors.map((doctor, index) => (
                  <Fade
                    in
                    timeout={300 + Math.min(index, 8) * 60}
                    key={doctor.id}
                  >
                    <Box
                      sx={{
                        width: 260,
                        flex: '0 0 260px',
                        display: 'flex',
                      }}
                    >
                      <DoctorCard doctor={doctor} index={index} />
                    </Box>
                  </Fade>
                ))}
              </Box>
            ) : (
              <EmptyState isRTL={isRTL} />
            )}
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}