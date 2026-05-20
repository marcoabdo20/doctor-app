import { useAuth } from '../context/AuthContext';
import { useDoctorAppointments } from '../hooks/useDoctorAppointments';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Chip,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import {
  CalendarMonth,
  AccessTime,
  Person,
  CheckCircle,
  Cancel,
  Pending,
  TrendingUp,
  People,
  Search
} from '@mui/icons-material';

export default function DoctorDashboard() {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  
  // ✅ HOOKS MUST BE FIRST - قبل أي return
  const { appointments, stats, loading, updateStatus } = useDoctorAppointments(currentUser?.uid);
  
  const [activeTab, setActiveTab] = useState(0);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [actionType, setActionType] = useState('');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // التحقق من الصلاحيات بعد جميع الـ Hooks
  if (!currentUser || userRole === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (userRole !== 'doctor') {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">Access denied. Doctors only.</Alert>
      </Container>
    );
  }

  const handleAction = async () => {
    if (!selectedAppointment || !actionType) return;
    
    const result = await updateStatus(selectedAppointment.id, actionType);
    if (result.success) {
      setSnackbar({
        open: true,
        message: `Appointment ${actionType} successfully!`,
        severity: 'success'
      });
      setSelectedAppointment(null);
      setActionType('');
      setNotes('');
    } else {
      setSnackbar({
        open: true,
        message: result.error || 'Failed to update appointment',
        severity: 'error'
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Pending color="warning" />;
      case 'confirmed': return <CheckCircle color="success" />;
      case 'completed': return <CheckCircle color="info" />;
      case 'cancelled': return <Cancel color="error" />;
      default: return null;
    }
  };

  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = !searchTerm || 
      app.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.patientEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = 
      activeTab === 0 ? ['pending', 'confirmed'].includes(app.status) :
      activeTab === 1 ? app.status === 'completed' :
      activeTab === 2 ? app.status === 'cancelled' : true;
    
    return matchesSearch && matchesTab;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Doctor Dashboard
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Welcome, Dr. {currentUser.displayName}
      </Typography>

      {/* إحصائيات */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <People color="primary" sx={{ mr: 1 }} />
                <Typography color="text.secondary">Total Patients</Typography>
              </Box>
              <Typography variant="h4">{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Pending color="warning" sx={{ mr: 1 }} />
                <Typography color="text.secondary">Pending</Typography>
              </Box>
              <Typography variant="h4">{stats.pending}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircle color="success" sx={{ mr: 1 }} />
                <Typography color="text.secondary">Confirmed</Typography>
              </Box>
              <Typography variant="h4">{stats.confirmed}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUp color="info" sx={{ mr: 1 }} />
                <Typography color="text.secondary">Completed</Typography>
              </Box>
              <Typography variant="h4">{stats.completed}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* قائمة المواعيد */}
      <Paper elevation={2}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <TextField
            placeholder="Search patients..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />
            }}
            sx={{ maxWidth: 300 }}
          />
        </Box>

        <Tabs 
          value={activeTab} 
          onChange={(e, v) => setActiveTab(v)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={`Upcoming (${stats.pending + stats.confirmed})`} />
          <Tab label={`Completed (${stats.completed})`} />
          <Tab label={`Cancelled (${stats.cancelled})`} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {filteredAppointments.length === 0 ? (
            <Alert severity="info">
              {searchTerm ? 'No matching appointments found' : 'No appointments found'}
            </Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Patient</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAppointments.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Person sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography>{app.patientName}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {app.patientEmail}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarMonth sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />
                          {app.date}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTime sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />
                          {app.time}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(app.status)}
                          label={app.status}
                          color={
                            app.status === 'pending' ? 'warning' :
                            app.status === 'confirmed' ? 'success' :
                            app.status === 'completed' ? 'info' : 'error'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {app.status === 'pending' && (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => {
                                setSelectedAppointment(app);
                                setActionType('confirmed');
                              }}
                            >
                              Confirm
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => {
                                setSelectedAppointment(app);
                                setActionType('cancelled');
                              }}
                            >
                              Reject
                            </Button>
                          </Box>
                        )}
                        
                        {app.status === 'confirmed' && (
                          <Button
                            size="small"
                            variant="contained"
                            color="info"
                            onClick={() => {
                              setSelectedAppointment(app);
                              setActionType('completed');
                            }}
                          >
                            Mark Complete
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>

      {/* Dialog */}
      <Dialog open={!!selectedAppointment} onClose={() => setSelectedAppointment(null)}>
        <DialogTitle>
          {actionType === 'confirmed' && 'Confirm Appointment'}
          {actionType === 'completed' && 'Complete Appointment'}
          {actionType === 'cancelled' && 'Cancel Appointment'}
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Patient: {selectedAppointment?.patientName}
          </Typography>
          <Typography gutterBottom>
            Date: {selectedAppointment?.date} at {selectedAppointment?.time}
          </Typography>
          
          <TextField
            label="Notes (Optional)"
            multiline
            rows={3}
            fullWidth
            sx={{ mt: 2 }}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedAppointment(null)}>Cancel</Button>
          <Button 
            variant="contained"
            color={actionType === 'cancelled' ? 'error' : 'primary'}
            onClick={handleAction}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <MuiAlert 
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
}