import { useState } from 'react';
import { useDoctors, useDoctorsBySpecialty } from '../hooks/useDoctors';
import DoctorCard from '../components/DoctorCard';
import {
  Container,
  Typography,
  Grid,
  Box,
  TextField,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';

const specialties = [
  'الكل',
  'قلب وأوعية دموية',
  'عظام',
  'جلدية',
  'أسنان',
  'أطفال',
  'عيون'
];

export default function DoctorsList() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { doctors: allDoctors, loading: allLoading, error } = useDoctors();
  const { doctors: filteredDoctors, loading: filteredLoading } = 
    useDoctorsBySpecialty(selectedSpecialty !== 'الكل' ? selectedSpecialty : null);

  const doctors = selectedSpecialty === 'الكل' ? allDoctors : filteredDoctors;
  const loading = selectedSpecialty === 'الكل' ? allLoading : filteredLoading;

  // تصفية حسب البحث
  const displayedDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.includes(searchTerm)
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">حدث خطأ: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        ابحث عن طبيبك
      </Typography>

      {/* البحث والفلترة */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 4,
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <TextField
          label="بحث"
          variant="outlined"
          placeholder="اسم الطبيب أو التخصص..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 250 }}
        />
        
        <TextField
          select
          label="التخصص"
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          {specialties.map((specialty) => (
            <MenuItem key={specialty} value={specialty}>
              {specialty}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* نتائج البحث */}
      <Typography variant="body1" sx={{ mb: 2 }}>
        عدد النتائج: {displayedDoctors.length} طبيب
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {displayedDoctors.map((doctor) => (
          <Grid item xs={12} sm={6} md={4} key={doctor.id}>
            <DoctorCard doctor={doctor} />
          </Grid>
        ))}
      </Grid>

      {displayedDoctors.length === 0 && (
        <Typography variant="h6" align="center" sx={{ py: 4 }} color="text.secondary">
          لا يوجد أطباء مطابقين للبحث
        </Typography>
      )}
    </Container>
  );
}