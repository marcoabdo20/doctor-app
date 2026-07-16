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
  Fade,
  InputAdornment,
  Avatar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import {
  CalendarMonth,
  AccessTime,
  CheckCircle,
  Cancel,
  Pending,
  TrendingUp,
  People,
  Search,
  Schedule,
} from '@mui/icons-material';

export default function DoctorDashboard() {
  const { currentUser, userRole } = useAuth();
  const { language } = useLanguage();

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

  useEffect(() => {
    async function fetchDoctor() {
      if (currentUser?.uid) {
        try {
          const docRef = doc(db, 'doctors', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) setDoctor({ id: docSnap.id, ...docSnap.data() });
        } catch (err) {
          console.error('Error fetching doctor:', err);
        }
      }
    }
    fetchDoctor();
  }, [currentUser]);

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
        severity: 'success',
      });
      setSelectedAppointment(null);
      setActionType('');
      setNotes('');
      refresh();
    } else {
      setSnackbar({
        open: true,
        message: result.error || (isRTL ? 'حدث خطأ' : 'An error occurred'),
        severity: 'error',
      });
    }
  };

  const statusConfig = {
    pending: { color: 'warning', label: isRTL ? 'معلق' : 'Pending', icon: <Pending sx={{ fontSize: 16 }} /> },
    confirmed: { color: 'success', label: isRTL ? 'مؤكد' : 'Confirmed', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
    completed: { color: 'info', label: isRTL ? 'مكتمل' : 'Completed', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
    cancelled: { color: 'error', label: isRTL ? 'ملغى' : 'Cancelled', icon: <Cancel sx={{ fontSize: 16 }} /> },
  };

  const filteredAppointments = appointments.filter((app) => {
    const matchesSearch = !searchTerm ||
      app.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.patientEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab =
      activeTab === 0 ? ['pending', 'confirmed'].includes(app.status) :
        activeTab === 1 ? app.status === 'completed' :
          activeTab === 2 ? app.status === 'cancelled' : true;
    return matchesSearch && matchesTab;
  });

  const statCards = [
    { icon: <People />, label: isRTL ? 'إجمالي المرضى' : 'Total Patients', value: stats.total, color: '#0f4c81', bg: 'rgba(15,76,129,0.08)' },
    { icon: <Pending />, label: isRTL ? 'في الانتظار' : 'Pending', value: stats.pending, color: '#d97706', bg: 'rgba(217,119,6,0.08)' },
    { icon: <CheckCircle />, label: isRTL ? 'مؤكدة' : 'Confirmed', value: stats.confirmed, color: '#059669', bg: 'rgba(5,150,105,0.08)' },
    { icon: <TrendingUp />, label: isRTL ? 'مكتملة' : 'Completed', value: stats.completed, color: '#0284c7', bg: 'rgba(2,132,199,0.08)' },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      dir={isRTL ? 'rtl' : 'ltr'}
      sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: { xs: 3, md: 4 } }}
    >
      <Container maxWidth="lg">
        <Fade in timeout={500}>
          <Box>

            {/* ── Header ── */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2, mb: 4,
            }}>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: '#0f4c81',
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit',
                    letterSpacing: isRTL ? 0 : '-0.5px',
                  }}
                >
                  {isRTL ? 'لوحة التحكم' : 'Dashboard'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit' }}>
                  {isRTL ? `مرحباً، د. ${currentUser.displayName}` : `Welcome back, Dr. ${currentUser.displayName}`}
                </Typography>
              </Box>

              <Box sx={{
                px: 2.5, py: 1.5,
                borderRadius: 3, bgcolor: '#fff',
                border: '1px solid', borderColor: 'divider',
                display: 'flex', alignItems: 'center', gap: 1.5,
              }}>
                <Avatar
                  sx={{
                    width: 36, height: 36,
                    background: 'linear-gradient(135deg, #0f4c81, #1a7a5e)',
                    fontSize: '0.9rem', fontWeight: 700,
                  }}
                >
                  {currentUser.displayName?.[0] || 'D'}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                    {currentUser.displayName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {isRTL ? 'طبيب' : 'Doctor'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* ── Stat Cards ── */}
            <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
              {statCards.map((stat, i) => (
                <Grid item xs={6} md={3} key={i}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: '1px solid', borderColor: 'divider',
                      transition: 'all 0.25s ease',
                      bgcolor: '#fff',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                        borderColor: stat.color,
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
                      <Box sx={{
                        width: 40, height: 40, borderRadius: 2,
                        bgcolor: stat.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: stat.color, mb: 1.5,
                        '& svg': { fontSize: 22 },
                      }}>
                        {stat.icon}
                      </Box>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 800, color: stat.color, lineHeight: 1, mb: 0.5, fontSize: { xs: '1.6rem', sm: '2rem' } }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.72rem', sm: '0.8rem' }, fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit' }}
                      >
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* ── Main Panel ── */}
            <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>

              {/* Main Tabs */}
              <Tabs
                value={settingsTab}
                onChange={(e, v) => setSettingsTab(v)}
                sx={{
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  bgcolor: '#fff',
                  px: { xs: 1, sm: 2 },
                  '& .MuiTab-root': {
                    fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit',
                    fontWeight: 600,
                    fontSize: { xs: '0.82rem', sm: '0.9rem' },
                    minHeight: 52,
                    textTransform: 'none',
                  },
                  '& .Mui-selected': { color: '#0f4c81' },
                  '& .MuiTabs-indicator': { bgcolor: '#0f4c81', height: 3, borderRadius: '3px 3px 0 0' },
                }}
              >
                <Tab icon={<CalendarMonth sx={{ fontSize: 18 }} />} iconPosition="start" label={isRTL ? 'المواعيد' : 'Appointments'} />
                <Tab icon={<Schedule sx={{ fontSize: 18 }} />} iconPosition="start" label={isRTL ? 'جدول العمل' : 'Schedule'} />
              </Tabs>

              {/* ── Appointments Tab ── */}
              {settingsTab === 0 && (
                <Box sx={{ p: { xs: 2, sm: 3 } }}>

                  {/* Search + Sub-tabs */}
                  <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'stretch', sm: 'center' },
                    gap: 2, mb: 2,
                  }}>
                    <TextField
                      placeholder={isRTL ? 'ابحث باسم المريض...' : 'Search by patient name...'}
                      size="small"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position={isRTL ? 'end' : 'start'}>
                              <Search sx={{ color: 'text.disabled', fontSize: 20 }} />
                            </InputAdornment>
                          ),
                        },
                      }}
                      sx={{
                        width: { xs: '100%', sm: 280 },
                        '& .MuiOutlinedInput-root': { borderRadius: 2.5 },
                      }}
                    />
                  </Box>

                  <Tabs
                    value={activeTab}
                    onChange={(e, v) => setActiveTab(v)}
                    sx={{
                      mb: 3, borderBottom: '1px solid', borderColor: 'divider',
                      '& .MuiTab-root': {
                        fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: { xs: '0.78rem', sm: '0.88rem' },
                        minHeight: 44,
                      },
                      '& .Mui-selected': { color: '#0f4c81' },
                      '& .MuiTabs-indicator': { bgcolor: '#0f4c81' },
                    }}
                  >
                    <Tab label={`${isRTL ? 'القادمة' : 'Upcoming'} (${stats.pending + stats.confirmed})`} />
                    <Tab label={`${isRTL ? 'المكتملة' : 'Completed'} (${stats.completed})`} />
                    <Tab label={`${isRTL ? 'الملغاة' : 'Cancelled'} (${stats.cancelled})`} />
                  </Tabs>

                  {filteredAppointments.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <CalendarMonth sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                      <Typography color="text.secondary" sx={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit' }}>
                        {isRTL ? 'لا توجد مواعيد في هذا القسم' : 'No appointments in this section'}
                      </Typography>
                    </Box>
                  ) : (
                    /* Responsive: Cards on mobile, Table on sm+ */
                    <>
                      {/* Mobile Cards */}
                      <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', gap: 2 }}>
                        {filteredAppointments.map((app) => (
                          <Card key={app.id} variant="outlined" sx={{ borderRadius: 3 }}>
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Avatar sx={{ width: 36, height: 36, bgcolor: 'rgba(15,76,129,0.1)', color: '#0f4c81', fontSize: '0.9rem' }}>
                                    {app.patientName?.[0] || 'P'}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{app.patientName}</Typography>
                                    <Typography variant="caption" color="text.secondary">{app.patientEmail}</Typography>
                                  </Box>
                                </Box>
                                <Chip
                                  label={statusConfig[app.status]?.label}
                                  color={statusConfig[app.status]?.color}
                                  size="small"
                                  sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                                />
                              </Box>
                              <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <CalendarMonth sx={{ fontSize: 15, color: 'text.disabled' }} />
                                  <Typography variant="caption">{app.date}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <AccessTime sx={{ fontSize: 15, color: 'text.disabled' }} />
                                  <Typography variant="caption">{app.time}</Typography>
                                </Box>
                              </Box>
                              {app.status === 'pending' && (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Button size="small" variant="contained" color="success"
                                    sx={{ borderRadius: 2, flex: 1, fontSize: '0.78rem' }}
                                    onClick={() => { setSelectedAppointment(app); setActionType('confirmed'); }}
                                  >
                                    {isRTL ? 'تأكيد' : 'Confirm'}
                                  </Button>
                                  <Button size="small" variant="outlined" color="error"
                                    sx={{ borderRadius: 2, flex: 1, fontSize: '0.78rem' }}
                                    onClick={() => { setSelectedAppointment(app); setActionType('cancelled'); }}
                                  >
                                    {isRTL ? 'رفض' : 'Reject'}
                                  </Button>
                                </Box>
                              )}
                              {app.status === 'confirmed' && (
                                <Button size="small" variant="contained" color="info"
                                  fullWidth sx={{ borderRadius: 2, fontSize: '0.78rem' }}
                                  onClick={() => { setSelectedAppointment(app); setActionType('completed'); }}
                                >
                                  {isRTL ? 'تمييز كمكتمل' : 'Mark Complete'}
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </Box>

                      {/* Desktop Table */}
                      <TableContainer sx={{ display: { xs: 'none', sm: 'block' }, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                        <Table>
                          <TableHead>
                            <TableRow sx={{ bgcolor: '#f8fafc' }}>
                              {[
                                isRTL ? 'المريض' : 'Patient',
                                isRTL ? 'التاريخ' : 'Date',
                                isRTL ? 'الوقت' : 'Time',
                                isRTL ? 'الحالة' : 'Status',
                                isRTL ? 'إجراءات' : 'Actions',
                              ].map((h) => (
                                <TableCell key={h} sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', py: 1.5 }}>
                                  {h}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredAppointments.map((app) => (
                              <TableRow key={app.id} hover sx={{ '&:hover': { bgcolor: 'rgba(15,76,129,0.02)' } }}>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Avatar sx={{ width: 36, height: 36, bgcolor: 'rgba(15,76,129,0.1)', color: '#0f4c81', fontSize: '0.9rem' }}>
                                      {app.patientName?.[0] || 'P'}
                                    </Avatar>
                                    <Box>
                                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{app.patientName}</Typography>
                                      <Typography variant="caption" color="text.secondary">{app.patientEmail}</Typography>
                                    </Box>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <CalendarMonth sx={{ fontSize: 16, color: 'text.disabled' }} />
                                    <Typography variant="body2">{app.date}</Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <AccessTime sx={{ fontSize: 16, color: 'text.disabled' }} />
                                    <Typography variant="body2">{app.time}</Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    icon={statusConfig[app.status]?.icon}
                                    label={statusConfig[app.status]?.label}
                                    color={statusConfig[app.status]?.color}
                                    size="small"
                                    sx={{ fontWeight: 600, fontSize: '0.78rem' }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {app.status === 'pending' && (
                                      <>
                                        <Button size="small" variant="contained" color="success"
                                          sx={{ borderRadius: 2, fontSize: '0.78rem', textTransform: 'none' }}
                                          onClick={() => { setSelectedAppointment(app); setActionType('confirmed'); }}
                                        >
                                          {isRTL ? 'تأكيد' : 'Confirm'}
                                        </Button>
                                        <Button size="small" variant="outlined" color="error"
                                          sx={{ borderRadius: 2, fontSize: '0.78rem', textTransform: 'none' }}
                                          onClick={() => { setSelectedAppointment(app); setActionType('cancelled'); }}
                                        >
                                          {isRTL ? 'رفض' : 'Reject'}
                                        </Button>
                                      </>
                                    )}
                                    {app.status === 'confirmed' && (
                                      <Button size="small" variant="contained" color="info"
                                        sx={{ borderRadius: 2, fontSize: '0.78rem', textTransform: 'none' }}
                                        onClick={() => { setSelectedAppointment(app); setActionType('completed'); }}
                                      >
                                        {isRTL ? 'مكتمل' : 'Mark Complete'}
                                      </Button>
                                    )}
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  )}
                </Box>
              )}

              {/* ── Schedule Tab ── */}
              {settingsTab === 1 && doctor && (
                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                  <DoctorScheduleSettings
                    doctor={doctor}
                    onUpdate={(newSchedule) => setDoctor({ ...doctor, availability: newSchedule })}
                  />
                </Box>
              )}
            </Paper>
          </Box>
        </Fade>
      </Container>

      {/* ── Action Dialog ── */}
      <Dialog
        open={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        PaperProps={{ sx: { borderRadius: 3, minWidth: { xs: '90vw', sm: 420 } } }}
      >
        <DialogTitle sx={{
          fontWeight: 700, pb: 1,
          fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit',
          borderBottom: '1px solid', borderColor: 'divider',
        }}>
          {actionType === 'confirmed' && (isRTL ? 'تأكيد الموعد' : 'Confirm Appointment')}
          {actionType === 'completed' && (isRTL ? 'إكمال الموعد' : 'Complete Appointment')}
          {actionType === 'cancelled' && (isRTL ? 'إلغاء الموعد' : 'Cancel Appointment')}
        </DialogTitle>
        <DialogContent sx={{ pt: 2.5 }}>
          <Box sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">{isRTL ? 'المريض' : 'Patient'}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedAppointment?.patientName}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">{isRTL ? 'التاريخ' : 'Date'}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedAppointment?.date}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">{isRTL ? 'الوقت' : 'Time'}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedAppointment?.time}</Typography>
            </Box>
          </Box>
          <TextField
            label={isRTL ? 'ملاحظات (اختياري)' : 'Notes (Optional)'}
            multiline rows={3} fullWidth
            value={notes} onChange={(e) => setNotes(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setSelectedAppointment(null)}
            variant="outlined"
            sx={{ borderRadius: 2, px: 3, textTransform: 'none' }}
          >
            {isRTL ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button
            variant="contained"
            color={actionType === 'cancelled' ? 'error' : 'primary'}
            onClick={handleAction}
            sx={{
              borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 700,
              background: actionType === 'cancelled'
                ? undefined
                : 'linear-gradient(135deg, #0f4c81, #1a7a5e)',
            }}
          >
            {isRTL ? 'تأكيد' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Snackbar ── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: isRTL ? 'left' : 'right' }}
      >
        <MuiAlert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}