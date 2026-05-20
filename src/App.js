import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import DoctorsList from './pages/DoctorsList';
import DoctorDetails from './pages/DoctorDetails';
import Booking from './pages/Booking';
import MyAppointments from './pages/MyAppointments';
import Navbar from './components/Navbar';
import DoctorDashboard from './pages/DoctorDashboard';

const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#2e7d32' },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/doctors" element={<DoctorsList />} />
            <Route path="/doctor/:id" element={<DoctorDetails />} />
            <Route path="/book/:doctorId" element={<Booking />} />
            <Route path="/appointments" element={<MyAppointments />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;