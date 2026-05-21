import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useDoctorAppointments } from '../hooks/useDoctorAppointments';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import DoctorScheduleSettings from '../components/DoctorScheduleSettings';
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
  Snackbar,
  Fade
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
  Search,
  Schedule
} from '@mui/icons-material';

export default function DoctorDashboard() {
  const { currentUser, userRole } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === 'ar';

  const [activeTab, setActiveTab] = useState(0);
  const [settingsTab, setSettingsTab] = useState(0);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [actionType, setActionType] = useState('');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [doctor, setDoctor] = useState(null);

  const { appointments, stats, loading, updateStatus, refresh } = useDoctorAppointments(currentUser?.uid);

  // ✅ FIXED: useEffect instead of useState
  useEffect(() => {
    async function fetchDoctor() {
      if (currentUser?.uid) {
        try {
          const docRef = doc(db, 'doctors', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setDoctor({ id: docSnap.id, ...docSnap.data() });
          }
        } catch (err) {
          console.error('Error fetching doctor:', err);
        }
      }
    }
    fetchDoctor();
  }, [currentUser]);

  // Debug: log appointments
  useEffect(() => {
    console.log('Doctor ID:', currentUser?.uid);
    console.log('Appointments:', appointments);
    console.log('Stats:', stats);
  }, [appointments, currentUser]);

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
        <Alert severity="error">
          {isRTL ? 'غير مصرح. للأطباء فقط.' : 'Access denied. Doctors only.'}
        </Alert>
      </Container>
    );
  }

  const handleAction = async () => {
    if (!selectedAppointment || !actionType) return;

    const result = await updateStatus(selectedAppointment.id, actionType);
    if (result.success) {
      setSnackbar({
        open: true,
        message: isRTL ? 'تم تحديث الموعد بنجاح!' : 'Appointment updated successfully!',
        severity: 'success'
      });
      setSelectedAppointment(null);
      setActionType('');
      setNotes('');
      refresh();
    } else {
      setSnackbar({
        open: true,
        message: result.error || (isRTL ? 'حدث خطأ' : 'An error occurred'),
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

  const getStatusLabel = (status) => {
    const labels = {
      pending: isRTL ? 'معلق' : 'Pending',
      confirmed: isRTL ? 'مؤكد' : 'Confirmed',
      completed: isRTL ? 'مكتمل' : 'Completed',
      cancelled: isRTL ? 'ملغى' : 'Cancelled'
    };
    return labels[status] || status;
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
      <Fade in timeout={500}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            {t('dashboard')}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {isRTL ? 'مرحباً، د.' : 'Welcome, Dr.'} {currentUser.displayName}
          </Typography>

          {/* Statistics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              { icon: <People color="primary" />, label: t('totalPatients'), value: stats.total },
              { icon: <Pending color="warning" />, label: t('pendingAppointments'), value: stats.pending },
              { icon: <CheckCircle color="success" />, label: t('confirmedAppointments'), value: stats.confirmed },
              { icon: <TrendingUp color="info" />, label: t('completedAppointments'), value: stats.completed }
            ].map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Card elevation={2} sx={{ borderRadius: 3, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {stat.icon}
                      <Typography color="text.secondary" sx={{ ml: 1, fontSize: '0.9rem' }}>{stat.label}</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>{stat.value}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Main Tabs */}
          <Paper elevation={2} sx={{ borderRadius: 3, mb: 3 }}>
            <Tabs 
              value={settingsTab} 
              onChange={(e, v) => setSettingsTab(v)}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab 
                icon={<CalendarMonth />} 
                label={isRTL ? 'المواعيد' : 'Appointments'} 
              />
              <Tab 
                icon={<Schedule />} 
                label={isRTL ? 'جدول العمل' : 'Schedule'} 
              />
            </Tabs>

            {/* Appointments Tab */}
            {settingsTab === 0 && (
              <Box sx={{ p: 3 }}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <TextField
                    placeholder={isRTL ? 'ابحث عن مريض...' : 'Search patients...'}
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
                  sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}
                >
                  <Tab label={`${t('upcoming')} (${stats.pending + stats.confirmed})`} />
                  <Tab label={`${t('completed')} (${stats.completed})`} />
                  <Tab label={`${t('cancelled')} (${stats.cancelled})`} />
                </Tabs>

                <Box sx={{ pt: 3 }}>
                  {filteredAppointments.length === 0 ? (
                    <Alert severity="info">
                      {isRTL ? 'لا توجد مواعيد في هذا القسم' : 'No appointments in this section'}
                    </Alert>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>{isRTL ? 'المريض' : 'Patient'}</TableCell>
                            <TableCell>{t('date')}</TableCell>
                            <TableCell>{t('time')}</TableCell>
                            <TableCell>{t('status')}</TableCell>
                            <TableCell>{isRTL ? 'إجراءات' : 'Actions'}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredAppointments.map((app) => (
                            <TableRow key={app.id} hover>
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
                                  label={getStatusLabel(app.status)}
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
                                      {t('confirm')}
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
                                      {t('reject')}
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
                                    {t('markComplete')}
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
              </Box>
            )}

            {/* Schedule Settings Tab */}
            {settingsTab === 1 && doctor && (
              <Box sx={{ p: 3 }}>
                <DoctorScheduleSettings 
                  doctor={doctor} 
                  onUpdate={(newSchedule) => setDoctor({ ...doctor, availability: newSchedule })}
                />
              </Box>
            )}
          </Paper>

          {/* Action Dialog */}
          <Dialog open={!!selectedAppointment} onClose={() => setSelectedAppointment(null)}>
            <DialogTitle>
              {actionType === 'confirmed' && (isRTL ? 'تأكيد الموعد' : 'Confirm Appointment')}
              {actionType === 'completed' && (isRTL ? 'إكمال الموعد' : 'Complete Appointment')}
              {actionType === 'cancelled' && (isRTL ? 'إلغاء الموعد' : 'Cancel Appointment')}
            </DialogTitle>
            <DialogContent>
              <Typography gutterBottom>
                {isRTL ? 'المريض' : 'Patient'}: {selectedAppointment?.patientName}
              </Typography>
              <Typography gutterBottom>
                {t('date')}: {selectedAppointment?.date} {t('time')}: {selectedAppointment?.time}
              </Typography>

              <TextField
                label={isRTL ? 'ملاحظات (اختياري)' : 'Notes (Optional)'}
                multiline
                rows={3}
                fullWidth
                sx={{ mt: 2 }}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedAppointment(null)}>{t('cancel')}</Button>
              <Button 
                variant="contained"
                color={actionType === 'cancelled' ? 'error' : 'primary'}
                onClick={handleAction}
              >
                {t('confirm')}
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
        </Box>
      </Fade>
    </Container>
  );
}