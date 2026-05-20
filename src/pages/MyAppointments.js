import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, orderBy, doc, updateDoc, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Chip,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField
} from '@mui/material';
import { CalendarMonth, AccessTime, LocationOn, Cancel, RateReview } from '@mui/icons-material';

export default function MyAppointments() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [cancelDialog, setCancelDialog] = useState(null);
  const [reviewDialog, setReviewDialog] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    fetchAppointments();
  }, [currentUser]);

  async function fetchAppointments() {
    try {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef,
        where('patientId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const apps = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setAppointments(apps);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function cancelAppointment(appointmentId) {
    try {
      const docRef = doc(db, 'appointments', appointmentId);
      await updateDoc(docRef, { status: 'cancelled', updatedAt: new Date() });
      setCancelDialog(null);
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  }

  async function submitReview(appointment) {
    try {
      // Add review
      await addDoc(collection(db, 'reviews'), {
        patientId: currentUser.uid,
        patientName: currentUser.displayName,
        doctorId: appointment.doctorId,
        doctorName: appointment.doctorName,
        appointmentId: appointment.id,
        rating: rating,
        comment: reviewText,
        createdAt: new Date()
      });

      // Update appointment status
      const docRef = doc(db, 'appointments', appointment.id);
      await updateDoc(docRef, { status: 'reviewed', updatedAt: new Date() });

      setReviewDialog(null);
      setRating(5);
      setReviewText('');
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  }

  const filteredAppointments = appointments.filter(app => {
    if (activeTab === 0) return ['pending', 'confirmed'].includes(app.status);
    if (activeTab === 1) return app.status === 'completed';
    if (activeTab === 2) return app.status === 'cancelled';
    return true;
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'success',
      completed: 'info',
      cancelled: 'error',
      reviewed: 'secondary'
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      completed: 'Completed',
      cancelled: 'Cancelled',
      reviewed: 'Reviewed'
    };
    return labels[status] || status;
  };

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
        My Appointments
      </Typography>

      <Tabs 
        value={activeTab} 
        onChange={(e, v) => setActiveTab(v)}
        sx={{ mb: 3 }}
      >
        <Tab label="Upcoming" />
        <Tab label="Completed" />
        <Tab label="Cancelled" />
      </Tabs>

      {filteredAppointments.length === 0 ? (
        <Alert severity="info">No appointments found</Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredAppointments.map((app) => (
            <Grid item xs={12} md={6} key={app.id}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">{app.doctorName}</Typography>
                  <Chip 
                    label={getStatusLabel(app.status)} 
                    color={getStatusColor(app.status)}
                    size="small"
                  />
                </Box>
                
                <Typography color="text.secondary" gutterBottom>
                  {app.doctorSpecialty}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarMonth sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">{app.date}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTime sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">{app.time}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">{app.price} EGP</Typography>
                </Box>

                {app.notes && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Notes: {app.notes}
                  </Typography>
                )}

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {['pending', 'confirmed'].includes(app.status) && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Cancel />}
                      onClick={() => setCancelDialog(app)}
                    >
                      Cancel
                    </Button>
                  )}
                  
                  {app.status === 'completed' && (
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      startIcon={<RateReview />}
                      onClick={() => setReviewDialog(app)}
                    >
                      Review
                    </Button>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Cancel Dialog */}
      <Dialog open={!!cancelDialog} onClose={() => setCancelDialog(null)}>
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel your appointment with Dr. {cancelDialog?.doctorName}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog(null)}>Keep</Button>
          <Button 
            color="error" 
            onClick={() => cancelAppointment(cancelDialog.id)}
          >
            Cancel Appointment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={!!reviewDialog} onClose={() => setReviewDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Rate Your Experience</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Dr. {reviewDialog?.doctorName}
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
              size="large"
            />
          </Box>
          
          <TextField
            label="Your Review"
            multiline
            rows={4}
            fullWidth
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience with this doctor..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialog(null)}>Skip</Button>
          <Button 
            variant="contained" 
            onClick={() => submitReview(reviewDialog)}
            disabled={!rating}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}