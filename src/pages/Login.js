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
  Alert,
  Fade,
  IconButton,
  InputAdornment,
  Divider
} from '@mui/material';
import { Language, Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  const isRTL = language === 'ar';

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(
        isRTL
          ? 'فشل تسجيل الدخول: البريد أو كلمة المرور غير صحيحة'
          : 'Login failed: Invalid email or password'
      );
    }
    setLoading(false);
  }

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
      {/* Decorative blobs */}
      <Box sx={{
        position: 'fixed', top: '-10%', left: '-5%',
        width: { xs: 200, md: 350 }, height: { xs: 200, md: 350 },
        borderRadius: '50%', background: 'rgba(255,255,255,0.04)',
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'fixed', bottom: '-10%', right: '-5%',
        width: { xs: 250, md: 400 }, height: { xs: 250, md: 400 },
        borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
        pointerEvents: 'none',
      }} />

      <Fade in timeout={700}>
        <Box sx={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>

          {/* Logo / Brand */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              mb: 2,
              fontSize: 28,
            }}>
              🏥
            </Box>
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, letterSpacing: '-0.5px' }}>
              {isRTL ? 'مرحباً بعودتك' : 'Welcome Back'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
              {isRTL ? 'سجّل دخولك للمتابعة' : 'Sign in to continue'}
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              background: 'rgba(255,255,255,0.97)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            {/* Language Toggle */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                size="small"
                onClick={toggleLanguage}
                startIcon={<Language sx={{ fontSize: 16 }} />}
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.8rem',
                  px: 1.5, py: 0.5,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
                }}
              >
                {isRTL ? 'English' : 'العربية'}
              </Button>
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.85rem' }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                label={t('email')}
                type="email"
                variant="outlined"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position={isRTL ? 'end' : 'start'}>
                        <Email sx={{ color: 'text.disabled', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
                inputProps={{ dir: 'ltr' }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2.5,
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                  },
                  '& label': { fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit' },
                }}
              />

              <TextField
                label={t('password')}
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position={isRTL ? 'end' : 'start'}>
                        <Lock sx={{ color: 'text.disabled', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position={isRTL ? 'start' : 'end'}>
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge={isRTL ? 'start' : 'end'}
                          size="small"
                        >
                          {showPassword
                            ? <VisibilityOff sx={{ fontSize: 18 }} />
                            : <Visibility sx={{ fontSize: 18 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                inputProps={{ dir: 'ltr' }}
                sx={{
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2.5,
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                  },
                  '& label': { fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit' },
                }}
              />

              <Box sx={{ textAlign: isRTL ? 'left' : 'right', mb: 3 }}>
                <Typography
                  component={Link}
                  to="/forgot-password"
                  variant="body2"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    fontSize: '0.82rem',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </Typography>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  py: 1.6,
                  borderRadius: 2.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  letterSpacing: isRTL ? 0 : '0.5px',
                  background: 'linear-gradient(135deg, #0f4c81 0%, #1a7a5e 100%)',
                  boxShadow: '0 4px 15px rgba(15,76,129,0.35)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0d3f6e 0%, #156649 100%)',
                    boxShadow: '0 6px 20px rgba(15,76,129,0.45)',
                    transform: 'translateY(-1px)',
                  },
                  '&:active': { transform: 'translateY(0)' },
                  '&.Mui-disabled': { background: '#ccc', boxShadow: 'none' },
                }}
              >
                {loading
                  ? (isRTL ? 'جارٍ الدخول...' : 'Signing in...')
                  : t('login')}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="caption" color="text.disabled">
                {isRTL ? 'أو' : 'OR'}
              </Typography>
            </Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('noAccount')}{' '}
                <Link
                  to="/signup"
                  style={{
                    color: '#0f4c81',
                    textDecoration: 'none',
                    fontWeight: 700,
                  }}
                >
                  {t('signup')}
                </Link>
              </Typography>
            </Box>
          </Paper>

          {/* Footer note */}
          <Typography
            variant="caption"
            sx={{ display: 'block', textAlign: 'center', color: 'rgba(255,255,255,0.5)', mt: 3 }}
          >
            {isRTL
              ? 'بياناتك محمية ومشفّرة بالكامل'
              : 'Your data is fully protected and encrypted'}
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
}