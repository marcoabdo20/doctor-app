import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
  Button
} from '@mui/material';
import { LocationOn, AttachMoney } from '@mui/icons-material';

export default function DoctorCard({ doctor }) {
  const navigate = useNavigate();

  return (
    <Card sx={{ 
      maxWidth: 345, 
      cursor: 'pointer',
      transition: 'transform 0.2s',
      '&:hover': { transform: 'translateY(-5px)' }
    }}>
      <CardMedia
        component="img"
        height="200"
        image={doctor.image || 'https://via.placeholder.com/400x300?text=Doctor'}
        alt={doctor.name}
      />
      
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {doctor.name}
        </Typography>
        
        <Chip 
          label={doctor.specialty} 
          color="primary" 
          size="small" 
          sx={{ mb: 1 }}
        />
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={doctor.rating || 0} precision={0.1} readOnly size="small" />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {doctor.rating} ({doctor.reviewsCount} تقييم)
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOn sx={{ fontSize: 16, color: 'text.secondary', ml: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {doctor.location}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AttachMoney sx={{ fontSize: 16, color: 'success.main', ml: 0.5 }} />
          <Typography variant="body2" color="success.main">
            {doctor.price} جنيه
          </Typography>
        </Box>
        
        <Button 
          variant="contained" 
          fullWidth
          onClick={() => navigate(`/doctor/${doctor.id}`)}
        >
          حجز موعد
        </Button>
      </CardContent>
    </Card>
  );
}