import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import {
  LocationOn,
  CalendarMonth,
  Favorite,
  FavoriteBorder,
  Star,
  AttachMoney,
} from '@mui/icons-material';

// ─── Design Tokens ────────────────────────────────────────────────────────────

const T = {
  teal50:  '#E8F5F0',
  teal100: '#C3E8D8',
  teal400: '#1D9E75',
  teal600: '#0F6E56',
  teal800: '#085041',
  amber:   '#F59E0B',
  green:   '#16A34A',
  neutral50:  '#F7F8FA',
  neutral100: '#ECEEF2',
  neutral600: '#6B7280',
};

const SPECIALTY_AR = {
  'General Medicine': 'طب عام',
  'Cardiology':       'قلب وأوعية دموية',
  'Dermatology':      'جلدية وتجميل',
  'Orthopedics':      'جراحة العظام',
  'Dentistry':        'أسنان وتقويم',
  'Pediatrics':       'طب الأطفال',
  'Ophthalmology':    'طب العيون',
  'Neurology':        'أعصاب',
  'Psychiatry':       'طب نفسي',
  'Gynecology':       'نساء وتوليد',
};

// ─── Initials Avatar (shown when no image) ────────────────────────────────────

function InitialsAvatar({ name }) {
  const initials = (name ?? '').trim().slice(0, 2);
  // Generate a consistent hue from the name string
  const hue = [...(name ?? '')].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 60 + 150;

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, hsl(${hue},55%,88%) 0%, hsl(${hue},45%,78%) 100%)`,
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: { xs: 62, sm: 72 },
          height: { xs: 62, sm: 72 },
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${T.teal400} 0%, ${T.teal600} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: { xs: '1.5rem', sm: '1.75rem' },
          fontWeight: 800,
          boxShadow: `0 4px 16px ${T.teal400}44`,
        }}
      >
        {initials}
      </Box>
    </Box>
  );
}

// ─── DoctorCard ───────────────────────────────────────────────────────────────

export default function DoctorCard({ doctor }) {
  const navigate     = useNavigate();
  const { language } = useLanguage();
  const isAr         = language === 'ar';
  const [fav, setFav]       = useState(false);
  const [imgErr, setImgErr] = useState(false);

  const specialty = isAr
    ? (SPECIALTY_AR[doctor.specialty] ?? doctor.specialty)
    : (doctor.specialty ?? '');

  const showImage = !imgErr && doctor.image;

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${T.neutral100}`,
        borderRadius: { xs: '14px', sm: '16px' },
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        direction: isAr ? 'rtl' : 'ltr',
        cursor: 'pointer',
        // ── Uniform height: all cards the same regardless of image ──
        height: '100%',
        minHeight: { xs: 420, sm: 460 },
        bgcolor: '#fff',
        transition: 'border-color .22s, box-shadow .22s, transform .22s',
        '&:hover': {
          borderColor: T.teal100,
          boxShadow: `0 8px 28px rgba(29,158,117,0.12)`,
          transform: 'translateY(-4px)',
        },
        '&:hover .doc-img': {
          transform: 'scale(1.05)',
        },
      }}
    >
      {/* ── Image / Avatar Section ─────────────────────────────────────────── */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          // Fixed height so all cards have identical image zones
          height: { xs: 180, sm: 200 },
          flexShrink: 0,
          overflow: 'hidden',
          bgcolor: T.teal50,
        }}
      >
        {showImage ? (
          <Box
            component="img"
            className="doc-img"
            src={doctor.image}
            alt={doctor.name}
            onError={() => setImgErr(true)}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
              display: 'block',
              transition: 'transform .35s ease',
            }}
          />
        ) : (
          <InitialsAvatar name={doctor.name} />
        )}

        {/* Only show the "Available" pill — never show "Unavailable" */}
        {doctor.available && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              [isAr ? 'left' : 'right']: 10,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              px: 1.25,
              py: 0.5,
              borderRadius: 100,
              fontSize: { xs: 10, sm: 11 },
              fontWeight: 700,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              bgcolor: 'rgba(232,245,240,0.95)',
              color: T.teal800,
              border: `1px solid ${T.teal100}`,
            }}
          >
            <Box
              component="span"
              sx={{
                width: 6, height: 6, borderRadius: '50%',
                bgcolor: T.teal400,
                flexShrink: 0,
              }}
            />
            {isAr ? 'متاح الآن' : 'Available'}
          </Box>
        )}

        {/* Rating pill */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            [isAr ? 'right' : 'left']: 10,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            px: 1.25,
            py: 0.5,
            borderRadius: 100,
            bgcolor: 'rgba(0,0,0,0.52)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: '#fff',
            fontSize: { xs: 11, sm: 12 },
            fontWeight: 700,
          }}
        >
          <Star sx={{ fontSize: 13, color: T.amber }} />
          {doctor.rating ?? 0}
          <Typography component="span" sx={{ fontSize: 10, opacity: 0.75 }}>
            ({doctor.reviewsCount ?? 0})
          </Typography>
        </Box>
      </Box>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          px: { xs: '14px', sm: '18px' },
          pt: { xs: '14px', sm: '16px' },
          pb: '10px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Name */}
        <Typography
          title={doctor.name}
          sx={{
            fontSize: { xs: 13.5, sm: 14.5 },
            fontWeight: 800,
            color: 'text.primary',
            mb: '6px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            letterSpacing: isAr ? 0 : '-0.2px',
          }}
        >
          {doctor.name}
        </Typography>

        {/* Specialty badge */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            bgcolor: T.teal50,
            color: T.teal600,
            fontSize: { xs: 10.5, sm: 11 },
            fontWeight: 700,
            px: '10px',
            py: '4px',
            borderRadius: 100,
            mb: '12px',
            width: 'fit-content',
            border: `1px solid ${T.teal100}`,
          }}
        >
          {specialty}
        </Box>

        {/* Divider */}
        <Box sx={{ height: '1px', bgcolor: T.neutral100, mb: '12px' }} />

        {/* Location */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '6px',
            mb: '8px',
            flexDirection: isAr ? 'row-reverse' : 'row',
          }}
        >
          <LocationOn sx={{ fontSize: 14, color: T.teal400, flexShrink: 0, mt: '2px' }} />
          <Typography
            sx={{
              fontSize: { xs: 11.5, sm: 12 },
              color: T.neutral600,
              lineHeight: 1.45,
              textAlign: isAr ? 'right' : 'left',
            }}
          >
            {doctor.location}
          </Typography>
        </Box>

        {/* Price */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            mb: '12px',
            flexDirection: isAr ? 'row-reverse' : 'row',
          }}
        >
          <AttachMoney sx={{ fontSize: 14, color: T.green, flexShrink: 0 }} />
          <Typography sx={{ fontSize: { xs: 12.5, sm: 13.5 }, fontWeight: 700, color: T.green }}>
            {doctor.price}{' '}
            <Box component="span" sx={{ fontWeight: 500, fontSize: '0.9em', opacity: 0.85 }}>
              {isAr ? 'جنيه' : 'EGP'}
            </Box>
          </Typography>
        </Box>

        {/* Mini stats — pushed to bottom with mt: auto */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            mt: 'auto',
          }}
        >
          <Box
            sx={{
              bgcolor: T.neutral50,
              borderRadius: '10px',
              p: { xs: '8px 6px', sm: '10px 8px' },
              textAlign: 'center',
              border: `1px solid ${T.neutral100}`,
              // Keep consistent height even when value is zero
              minHeight: 52,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              sx={{ fontSize: { xs: 12.5, sm: 14 }, fontWeight: 800, color: T.teal400, lineHeight: 1.1 }}
            >
              {(doctor.patients ?? 0).toLocaleString()}
            </Typography>
            <Typography sx={{ fontSize: 10, color: T.neutral600, mt: '3px', fontWeight: 500 }}>
              {isAr ? 'مريض' : 'patients'}
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: T.neutral50,
              borderRadius: '10px',
              p: { xs: '8px 6px', sm: '10px 8px' },
              textAlign: 'center',
              border: `1px solid ${T.neutral100}`,
              minHeight: 52,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              sx={{ fontSize: { xs: 12.5, sm: 14 }, fontWeight: 800, color: T.teal400, lineHeight: 1.1 }}
            >
              {doctor.experience ?? 0}+
            </Typography>
            <Typography sx={{ fontSize: 10, color: T.neutral600, mt: '3px', fontWeight: 500 }}>
              {isAr ? 'سنة خبرة' : 'yrs exp'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Footer / CTA ───────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          gap: '8px',
          px: { xs: '14px', sm: '18px' },
          pb: { xs: '14px', sm: '18px' },
          pt: '8px',
          direction: isAr ? 'rtl' : 'ltr',
        }}
      >
        <Box
          component="button"
          onClick={() => navigate(`/book/${doctor.id}`)}
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            background: `linear-gradient(135deg, ${T.teal400} 0%, ${T.teal600} 100%)`,
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            py: { xs: '9px', sm: '10px' },
            px: { xs: '8px', sm: '12px' },
            fontSize: { xs: 11.5, sm: 12.5 },
            fontWeight: 700,
            fontFamily: 'inherit',
            cursor: 'pointer',
            boxShadow: `0 2px 8px ${T.teal400}33`,
            transition: 'all .2s',
            '&:hover': {
              background: `linear-gradient(135deg, ${T.teal600} 0%, ${T.teal800} 100%)`,
              boxShadow: `0 4px 14px ${T.teal400}44`,
              transform: 'translateY(-1px)',
            },
            '&:active': { transform: 'scale(0.98)' },
          }}
        >
          <CalendarMonth sx={{ fontSize: 15 }} />
          {isAr ? 'احجز موعد' : 'Book appointment'}
        </Box>

        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); setFav((f) => !f); }}
          aria-label={isAr ? 'إضافة للمفضلة' : 'Add to favourites'}
          sx={{
            width: 38,
            height: 38,
            border: `1.5px solid ${fav ? '#FDA4AF' : T.neutral100}`,
            borderRadius: '10px',
            flexShrink: 0,
            color:   fav ? '#E11D48' : T.neutral600,
            bgcolor: fav ? '#FFF1F2' : T.neutral50,
            transition: 'all .2s',
            '&:hover': {
              color: '#E11D48',
              borderColor: '#FDA4AF',
              bgcolor: '#FFF1F2',
              transform: 'scale(1.06)',
            },
          }}
        >
          {fav
            ? <Favorite       sx={{ fontSize: 17 }} />
            : <FavoriteBorder sx={{ fontSize: 17 }} />}
        </IconButton>
      </Box>
    </Paper>
  );
}