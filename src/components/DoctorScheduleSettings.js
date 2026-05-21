import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Chip,
  Grid,
  Switch,
  FormControlLabel,
  Alert,
  Divider,
  IconButton
} from '@mui/material';
import { AccessTime, Save, Add, Delete, Schedule } from '@mui/icons-material';

const daysEn = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const daysAr = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

const defaultHours = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

export default function DoctorScheduleSettings({ doctor, onUpdate }) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const [schedule, setSchedule] = useState(doctor?.availability || {});
  const [workingDays, setWorkingDays] = useState(
    Object.keys(doctor?.availability || {}).filter(day => doctor.availability[day]?.length > 0)
  );
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const toggleDay = (day) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter(d => d !== day));
      const newSchedule = { ...schedule };
      newSchedule[day] = [];
      setSchedule(newSchedule);
    } else {
      setWorkingDays([...workingDays, day]);
      const newSchedule = { ...schedule };
      newSchedule[day] = ['09:00', '10:00', '11:00', '12:00'];
      setSchedule(newSchedule);
    }
  };

  const addHour = (day, hour) => {
    if (!schedule[day]?.includes(hour)) {
      const newSchedule = { ...schedule };
      newSchedule[day] = [...(newSchedule[day] || []), hour].sort();
      setSchedule(newSchedule);
    }
  };

  const removeHour = (day, hour) => {
    const newSchedule = { ...schedule };
    newSchedule[day] = newSchedule[day].filter(h => h !== hour);
    setSchedule(newSchedule);
  };

  const handleSave = async () => {
    try {
      setError('');
      setSuccess('');

      const doctorRef = doc(db, 'doctors', doctor.id);
      await updateDoc(doctorRef, {
        availability: schedule,
        updatedAt: new Date()
      });

      setSuccess(isRTL ? 'تم حفظ الجدول بنجاح!' : 'Schedule saved successfully!');
      if (onUpdate) onUpdate(schedule);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Schedule color="primary" sx={{ mr: 1, ml: isRTL ? 1 : 0 }} />
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {isRTL ? 'إعدادات جدول العمل' : 'Working Hours Settings'}
        </Typography>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
        {isRTL ? 'اختر أيام العمل وساعات كل يوم:' : 'Select working days and hours for each day:'}
      </Typography>

      <Grid container spacing={3}>
        {daysEn.map((day, index) => (
          <Grid item xs={12} md={6} key={day}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                borderRadius: 2,
                border: workingDays.includes(day) ? '2px solid #667eea' : '1px solid #e0e0e0',
                transition: 'all 0.3s'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={workingDays.includes(day)}
                      onChange={() => toggleDay(day)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {isRTL ? daysAr[index] : day.charAt(0).toUpperCase() + day.slice(1)}
                    </Typography>
                  }
                />
                {workingDays.includes(day) && (
                  <Chip 
                    label={isRTL ? 'يوم عمل' : 'Working Day'} 
                    color="success" 
                    size="small" 
                    sx={{ fontWeight: 600 }}
                  />
                )}
              </Box>

              {workingDays.includes(day) && (
                <>
                  <Divider sx={{ mb: 2 }} />

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {isRTL ? 'الساعات المتاحة:' : 'Available Hours:'}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {schedule[day]?.map((hour) => (
                      <Chip
                        key={hour}
                        label={hour}
                        onDelete={() => removeHour(day, hour)}
                        color="primary"
                        variant="outlined"
                        size="small"
                        deleteIcon={<Delete />}
                      />
                    ))}
                    {(!schedule[day] || schedule[day].length === 0) && (
                      <Typography variant="body2" color="text.secondary">
                        {isRTL ? 'لا توجد ساعات محددة' : 'No hours set'}
                      </Typography>
                    )}
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {isRTL ? 'إضافة ساعة:' : 'Add Hour:'}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {defaultHours.map((hour) => (
                      <Button
                        key={hour}
                        size="small"
                        variant={schedule[day]?.includes(hour) ? "contained" : "outlined"}
                        disabled={schedule[day]?.includes(hour)}
                        onClick={() => addHour(day, hour)}
                        startIcon={!schedule[day]?.includes(hour) ? <Add /> : null}
                        sx={{ minWidth: 80 }}
                      >
                        {hour}
                      </Button>
                    ))}
                  </Box>
                </>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          startIcon={<Save />}
          sx={{
            borderRadius: 2,
            px: 4,
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            '&:hover': {
              background: 'linear-gradient(45deg, #764ba2, #667eea)',
            }
          }}
        >
          {isRTL ? 'حفظ الجدول' : 'Save Schedule'}
        </Button>
      </Box>
    </Paper>
  );
}