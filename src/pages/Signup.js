
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
  IconButton
} from '@mui/material';
import { Language, ArrowForward } from '@mui/icons-material';

const specialties = [
  'General Medicine',
  'Cardiology',
  'Dermatology',
  'Orthopedics',
  'Pediatrics',
  'Dentistry',
  'Ophthalmology',
  'Neurology',
  'Psychiatry',
  'Gynecology'
];

export default function Signup() {
  const { signup } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [role, setRole] = useState('patient');

  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Doctor fields
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [bio, setBio] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const steps = role === 'doctor' 
    ? [t('accountType'), t('personalInfo'), t('professionalInfo')]
    : [t('accountType'), t('personalInfo')];

  const handleNext = () => {
    if (activeStep === 0 && !role) {
      setError(t('selectRole'));
      return;
    }
    if (activeStep === 1) {
      if (!name || !email || !password || !phone) {
        setError(t('fillAllFields'));
        return;
      }
      if (password.length < 6) {
        setError(t('passwordMinLength'));
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
      setError(t('fillAllFields'));
      return;
    }

    try {
      setError('');
      setLoading(true);

      const extraData = role === 'doctor' ? {
        specialty,
        location,
        price: Number(price),
        bio,
        phone
      } : { phone };

      await signup(email, password, name, role, extraData);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      p: 2
    }}>
      <Fade in timeout={800}>
        <Paper elevation={10} sx={{ 
          p: { xs: 3, md: 5 }, 
          width: '100%', 
          maxWidth: 600,
          borderRadius: 3
        }}>
          {/* Language Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton onClick={toggleLanguage} color="primary">
              <Language />
            </IconButton>
          </Box>

          <Typography variant="h4" align="center" gutterBottom sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {t('signupTitle')}
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          <Stepper activeStep={activeStep} sx={{ mb: 4, direction: language === 'ar' ? 'rtl' : 'ltr' }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit}>
            {/* Step 0: Select Role */}
            {activeStep === 0 && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  {t('selectAccountType')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
                  <Paper
                    onClick={() => setRole('patient')}
                    sx={{
                      p: 3,
                      cursor: 'pointer',
                      border: role === 'patient' ? '3px solid #667eea' : '2px solid #e0e0e0',
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': { transform: 'translateY(-5px)', boxShadow: 4 }
                    }}
                  >
                    <Typography variant="h5">👤</Typography>
                    <Typography variant="h6">{t('patient')}</Typography>
                  </Paper>

                  <Paper
                    onClick={() => setRole('doctor')}
                    sx={{
                      p: 3,
                      cursor: 'pointer',
                      border: role === 'doctor' ? '3px solid #667eea' : '2px solid #e0e0e0',
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': { transform: 'translateY(-5px)', boxShadow: 4 }
                    }}
                  >
                    <Typography variant="h5">👨‍⚕️</Typography>
                    <Typography variant="h6">{t('doctor')}</Typography>
                  </Paper>
                </Box>
              </Box>
            )}

            {/* Step 1: Personal Info */}
            {activeStep === 1 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label={t('name')}
                  variant="outlined"
                  fullWidth
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{ borderRadius: 2 }}
                />

                <TextField
                  label={t('email')}
                  type="email"
                  variant="outlined"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                  label={t('password')}
                  type="password"
                  variant="outlined"
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  helperText={t('passwordMinLength')}
                />

                <TextField
                  label={t('phone')}
                  variant="outlined"
                  fullWidth
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Box>
            )}

            {/* Step 2: Doctor Professional Info */}
            {activeStep === 2 && role === 'doctor' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth required>
                  <InputLabel>{t('specialty')}</InputLabel>
                  <Select
                    value={specialty}
                    label={t('specialty')}
                    onChange={(e) => setSpecialty(e.target.value)}
                  >
                    {specialties.map((spec) => (
                      <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label={t('location')}
                  variant="outlined"
                  fullWidth
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Cairo - Nasr City"
                />

                <TextField
                  label={t('price')}
                  type="number"
                  variant="outlined"
                  fullWidth
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g., 300"
                />

                <TextField
                  label={t('bio')}
                  multiline
                  rows={3}
                  variant="outlined"
                  fullWidth
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={t('bioPlaceholder')}
                />
              </Box>
            )}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                {t('back')}
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  endIcon={<ArrowForward />}
                  sx={{
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #764ba2, #667eea)',
                    }
                  }}
                >
                  {loading ? t('loading') : t('signup')}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowForward />}
                >
                  {t('next')}
                </Button>
              )}
            </Box>
          </form>

          <Typography align="center" sx={{ mt: 3 }}>
            {t('haveAccount')} <Link to="/login" style={{ 
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: 600
            }}>{t('login')}</Link>
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
}