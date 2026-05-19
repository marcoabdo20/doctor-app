import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
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
  Alert 
} from '@mui/material';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (password.length < 6) {
      return setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password, name, role);
      navigate('/'); // الذهاب للصفحة الرئيسية بعد التسجيل
    } catch (err) {
      setError('فشل إنشاء الحساب: ' + err.message);
    }
    
    setLoading(false);
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: '#f5f5f5'
    }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: '#1976d2' }}>
          إنشاء حساب جديد
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="الاسم الكامل"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <TextField
            label="البريد الإلكتروني"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <TextField
            label="كلمة المرور"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>نوع الحساب</InputLabel>
            <Select
              value={role}
              label="نوع الحساب"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="patient">مريض</MenuItem>
              <MenuItem value="doctor">طبيب</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 2, bgcolor: '#1976d2' }}
          >
            {loading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
          </Button>
        </form>
        
        <Typography align="center" sx={{ mt: 2 }}>
          لديك حساب؟ <Link to="/login" style={{ color: '#1976d2' }}>تسجيل الدخول</Link>
        </Typography>
      </Paper>
    </Box>
  );
}