import { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Rating,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Star, Send } from '@mui/icons-material';
import { addReview } from '../hooks/useReviews';
import { useAuth } from '../context/AuthContext';

export default function ReviewForm({ doctorId, doctorName, onSuccess }) {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setError('Please login to submit a review');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const result = await addReview({
        patientId: currentUser.uid,
        patientName: currentUser.displayName || 'Anonymous',
        patientEmail: currentUser.email,
        doctorId: doctorId,
        doctorName: doctorName,
        rating: rating,
        comment: comment.trim(),
      });

      if (result.success) {
        setSuccess(true);
        setRating(0);
        setComment('');
        if (onSuccess) onSuccess();
      } else {
        setError(result.error || 'Failed to submit review');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Alert severity="success" sx={{ mb: 2 }}>
        Thank you for your review! Your feedback helps others.
      </Alert>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Write a Review
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 3 }}>
          <Typography component="legend" gutterBottom>
            Your Rating
          </Typography>
          <Rating
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
            size="large"
            icon={<Star fontSize="inherit" />}
            emptyIcon={<Star fontSize="inherit" />}
          />
        </Box>

        <TextField
          label="Your Review"
          multiline
          rows={4}
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={`Share your experience with Dr. ${doctorName}...`}
          sx={{ mb: 3 }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <Send />}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </Paper>
  );
}