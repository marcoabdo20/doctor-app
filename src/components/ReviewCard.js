import {
  Paper,
  Box,
  Typography,
  Rating,
  Avatar,
} from '@mui/material';
import { Person, CalendarMonth } from '@mui/icons-material';

export default function ReviewCard({ review }) {
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          <Person />
        </Avatar>

        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {review.patientName || 'Anonymous Patient'}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarMonth
                sx={{ fontSize: 16, color: 'text.secondary' }}
              />
              <Typography variant="body2" color="text.secondary">
                {formatDate(review.createdAt)}
              </Typography>
            </Box>
          </Box>

          <Rating value={review.rating || 0} readOnly size="small" sx={{ mb: 1 }} />

          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
            {review.comment || 'No comment provided.'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}