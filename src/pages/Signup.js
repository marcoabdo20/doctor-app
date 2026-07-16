import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Fade,
  IconButton,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Language,
  ArrowForward,
  ArrowBack,
  PersonOutlined,
  MedicalServicesOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

const specialties = [
  { en: 'General Medicine', ar: 'طب عام' },
  { en: 'Cardiology', ar: 'أمراض القلب' },
  { en: 'Dermatology', ar: 'الأمراض الجلدية' },
  { en: 'Orthopedics', ar: 'العظام' },
  { en: 'Pediatrics', ar: 'طب الأطفال' },
  { en: 'Dentistry', ar: 'طب الأسنان' },
  { en: 'Ophthalmology', ar: 'طب العيون' },
  { en: 'Neurology', ar: 'الأعصاب' },
  { en: 'Psychiatry', ar: 'الطب النفسي' },
  { en: 'Gynecology', ar: 'النساء والتوليد' },
];

export default function Signup() {
  const { signup } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  const isRTL = language === 'ar';

  const [activeStep, setActiveStep] = useState(0);
  const [role, setRole] = useState('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const steps = role === 'doctor'
    ? [
      isRTL ? 'نوع الحساب' : 'Account Type',
      isRTL ? 'المعلومات الشخصية' : 'Personal Info',
      isRTL ? 'المعلومات المهنية' : 'Professional Info',
    ]
    : [
      isRTL ? 'نوع الحساب' : 'Account Type',
      isRTL ? 'المعلومات الشخصية' : 'Personal Info',
    ];

  const handleNext = () => {
    if (activeStep === 0 && !role) {
      setError(isRTL ? 'يرجى اختيار نوع الحساب' : 'Please select an account type');
      return;
    }
    if (activeStep === 1) {
      if (!name || !email || !password || !phone) {
        setError(isRTL ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
        return;
      }
      if (password.length < 6) {
        setError(isRTL ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
        return;
      }
    }
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (role === 'doctor' && (!specialty || !location || !price)) {
      setError(isRTL ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }
    try {
      setError('');
      setLoading(true);
      const extraData = role === 'doctor'
        ? { specialty, location, price: Number(price), bio, phone }
        : { phone };
      await signup(email, password, name, role, extraData);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2.5,
      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
    },
    '& label': { fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit' },
  };

  return (
    <Box
      dir={isRTL ? 'rtl' : 'ltr'}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f4c81 0%, #1a7a5e 50%, #0f4c81 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 12s ease infinite',
        p: { xs: 2, sm: 3 },
        '@keyframes gradientShift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }}
    >
      <Fade in timeout={700}>
        <Box sx={{ width: '100%', maxWidth: 580, position: 'relative', zIndex: 1 }}>

          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 60, height: 60, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              mb: 1.5, fontSize: 26,
            }}>
              🏥
            </Box>
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, letterSpacing: '-0.5px' }}>
              {isRTL ? 'إنشاء حساب جديد' : 'Create Your Account'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', mt: 0.5 }}>
              {isRTL ? 'انضم إلينا اليوم' : 'Join us today'}
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              background: 'rgba(255,255,255,0.97)',
            }}
          >
            {/* Top bar: Language + Step indicator */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Chip
                label={`${activeStep + 1} / ${steps.length}`}
                size="small"
                sx={{ bgcolor: 'primary.50', color: 'primary.main', fontWeight: 600, fontSize: '0.8rem' }}
              />
              <Button
                size="small"
                onClick={toggleLanguage}
                startIcon={<Language sx={{ fontSize: 16 }} />}
                sx={{
                  color: 'text.secondary', fontSize: '0.8rem',
                  px: 1.5, py: 0.5, borderRadius: 2,
                  border: '1px solid', borderColor: 'divider',
                  '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
                }}
              >
                {isRTL ? 'English' : 'العربية'}
              </Button>
            </Box>

            {/* Stepper */}
            <Stepper
              activeStep={activeStep}
              sx={{
                mb: 4,
                '& .MuiStepLabel-label': {
                  fontSize: { xs: '0.7rem', sm: '0.85rem' },
                  fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit',
                },
                '& .MuiStepConnector-line': { borderColor: 'divider' },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {error && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.85rem' }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>

              {/* ── Step 0: Role Selection ── */}
              {activeStep === 0 && (
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600, mb: 3, textAlign: 'center',
                      color: 'text.primary',
                      fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit',
                    }}
                  >
                    {isRTL ? 'كيف ستستخدم المنصة؟' : 'How will you use the platform?'}
                  </Typography>

                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                  }}>
                    {[
                      {
                        value: 'patient',
                        icon: <PersonOutlined sx={{ fontSize: 36, mb: 1 }} />,
                        label: isRTL ? 'مريض' : 'Patient',
                        desc: isRTL ? 'احجز مواعيد مع أطباء متخصصين' : 'Book appointments with specialists',
                      },
                      {
                        value: 'doctor',
                        icon: <MedicalServicesOutlined sx={{ fontSize: 36, mb: 1 }} />,
                        label: isRTL ? 'طبيب' : 'Doctor',
                        desc: isRTL ? 'أدر مواعيدك ومرضاك بسهولة' : 'Manage appointments & patients',
                      },
                    ].map((opt) => (
                      <Box
                        key={opt.value}
                        onClick={() => setRole(opt.value)}
                        sx={{
                          p: { xs: 2.5, sm: 3 },
                          borderRadius: 3,
                          border: '2px solid',
                          borderColor: role === opt.value ? 'primary.main' : 'divider',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.25s ease',
                          background: role === opt.value ? 'rgba(15,76,129,0.05)' : 'transparent',
                          color: role === opt.value ? 'primary.main' : 'text.secondary',
                          '&:hover': {
                            borderColor: 'primary.main',
                            background: 'rgba(15,76,129,0.05)',
                            transform: 'translateY(-3px)',
                            boxShadow: '0 8px 24px rgba(15,76,129,0.12)',
                          },
                        }}
                      >
                        {opt.icon}
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit' }}>
                          {opt.label}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.82rem', color: 'text.secondary', fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit' }}>
                          {opt.desc}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* ── Step 1: Personal Info ── */}
              {activeStep === 1 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField label={isRTL ? 'الاسم الكامل' : 'Full Name'} variant="outlined" fullWidth required
                    value={name} onChange={(e) => setName(e.target.value)} sx={inputSx}
                  />
                  <TextField label={t('email')} type="email" variant="outlined" fullWidth required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    inputProps={{ dir: 'ltr' }}
                    sx={inputSx}
                  />
                  <TextField
                    label={t('password')} type={showPassword ? 'text' : 'password'}
                    variant="outlined" fullWidth required
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    helperText={isRTL ? '6 أحرف على الأقل' : 'Minimum 6 characters'}
                    inputProps={{ dir: 'ltr' }}
                    slotProps={{
                      input: {
                        dir: 'ltr',
                        endAdornment: (
                          <InputAdornment position={isRTL ? 'start' : 'end'}>
                            <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                              {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={inputSx}
                  />
                  <TextField label={isRTL ? 'رقم الهاتف' : 'Phone Number'} variant="outlined" fullWidth required
                    value={phone} onChange={(e) => setPhone(e.target.value)}
                    inputProps={{ dir: 'ltr' }}
                    sx={inputSx}
                  />
                </Box>
              )}

              {/* ── Step 2: Doctor Info ── */}
              {activeStep === 2 && role === 'doctor' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControl fullWidth required sx={inputSx}>
                    <InputLabel sx={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit' }}>
                      {t('specialty')}
                    </InputLabel>
                    <Select
                      value={specialty}
                      label={t('specialty')}
                      onChange={(e) => setSpecialty(e.target.value)}
                      sx={{ borderRadius: 2.5 }}
                    >
                      {specialties.map((spec) => (
                        <MenuItem key={spec.en} value={spec.en}>
                          {isRTL ? spec.ar : spec.en}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label={isRTL ? 'موقع العيادة' : 'Clinic Location'}
                    variant="outlined" fullWidth required
                    value={location} onChange={(e) => setLocation(e.target.value)}
                    placeholder={isRTL ? 'مثال: القاهرة - مدينة نصر' : 'e.g., Cairo - Nasr City'}
                    sx={inputSx}
                  />

                  <TextField
                    label={isRTL ? 'سعر الكشف (جنيه)' : 'Consultation Price (EGP)'}
                    type="number" variant="outlined" fullWidth required
                    value={price} onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g., 300"
                    inputProps={{ dir: 'ltr', min: 0 }}
                    sx={inputSx}
                  />

                  <TextField
                    label={isRTL ? 'نبذة عن الطبيب' : 'About You'}
                    multiline rows={3} variant="outlined" fullWidth
                    value={bio} onChange={(e) => setBio(e.target.value)}
                    placeholder={isRTL ? 'اكتب نبذة مختصرة عن خبرتك...' : 'Brief description of your experience...'}
                    sx={inputSx}
                  />
                </Box>
              )}

              {/* ── Navigation ── */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 4,
                flexDirection: isRTL ? 'row-reverse' : 'row',
              }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                  startIcon={isRTL ? <ArrowForward /> : <ArrowBack />}
                  sx={{ borderRadius: 2.5, px: 3, visibility: activeStep === 0 ? 'hidden' : 'visible' }}
                >
                  {isRTL ? 'السابق' : 'Back'}
                </Button>

                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    endIcon={isRTL ? <ArrowBack /> : <ArrowForward />}
                    sx={{
                      borderRadius: 2.5, px: 4, py: 1.4,
                      fontWeight: 600, fontSize: '0.95rem',
                      background: 'linear-gradient(135deg, #0f4c81 0%, #1a7a5e 100%)',
                      boxShadow: '0 4px 15px rgba(15,76,129,0.35)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0d3f6e 0%, #156649 100%)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 6px 20px rgba(15,76,129,0.45)',
                      },
                      '&.Mui-disabled': { background: '#ccc', boxShadow: 'none' },
                    }}
                  >
                    {loading
                      ? (isRTL ? 'جارٍ الإنشاء...' : 'Creating...')
                      : (isRTL ? 'إنشاء الحساب' : 'Create Account')}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    endIcon={isRTL ? <ArrowBack /> : <ArrowForward />}
                    sx={{
                      borderRadius: 2.5, px: 4, py: 1.4,
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #0f4c81 0%, #1a7a5e 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0d3f6e 0%, #156649 100%)',
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    {isRTL ? 'التالي' : 'Next'}
                  </Button>
                )}
              </Box>
            </Box>

            <Typography align="center" sx={{ mt: 3, fontSize: '0.88rem', color: 'text.secondary' }}>
              {isRTL ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
              <Link to="/login" style={{ color: '#0f4c81', textDecoration: 'none', fontWeight: 700 }}>
                {t('login')}
              </Link>
            </Typography>
          </Paper>
        </Box>
      </Fade>
    </Box>
  );
}