import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Grid,
  Switch,
  FormControlLabel,
  Alert,
  Divider,
  TextField,
  IconButton,
  Stack,
} from '@mui/material';
import {
  Save,
  Add,
  Delete,
  Schedule,
  FreeBreakfast,
  EventBusy,
} from '@mui/icons-material';

const daysEn = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const daysAr = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

const defaultHours = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

// Empty template for a new time-off entry
const emptyTimeOff = { startDate: '', endDate: '', reason: '' };

export default function DoctorScheduleSettings({ doctor, onUpdate }) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  // ── Working days & hours (existing behaviour) ──
  const [schedule, setSchedule] = useState(doctor?.availability || {});
  const [workingDays, setWorkingDays] = useState(
    Object.keys(doctor?.availability || {}).filter(day => doctor.availability[day]?.length > 0)
  );

  // ── Daily breaks (new) ──
  // shape: { saturday: { start: '13:00', end: '14:00' }, ... }
  const [breaks, setBreaks] = useState(doctor?.breaks || {});

  // ── Vacation / time off (new) ──
  // shape: [{ id, startDate, endDate, reason }]
  const [timeOff, setTimeOff] = useState(doctor?.timeOff || []);
  const [newTimeOff, setNewTimeOff] = useState(emptyTimeOff);

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // ── Working days & hours handlers ──
  const toggleDay = (day) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter(d => d !== day));
      const newSchedule = { ...schedule };
      newSchedule[day] = [];
      setSchedule(newSchedule);
      // remove any break tied to a day that's no longer a working day
      const newBreaks = { ...breaks };
      delete newBreaks[day];
      setBreaks(newBreaks);
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

  // ── Break handlers ──
  const setBreakField = (day, field, value) => {
    const current = breaks[day] || { start: '', end: '' };
    setBreaks({ ...breaks, [day]: { ...current, [field]: value } });
  };

  const removeBreak = (day) => {
    const newBreaks = { ...breaks };
    delete newBreaks[day];
    setBreaks(newBreaks);
  };

  // ── Time off handlers ──
  const addTimeOff = () => {
    if (!newTimeOff.startDate || !newTimeOff.endDate) {
      setError(isRTL ? 'من فضلك حدد تاريخ البداية والنهاية' : 'Please set a start and end date');
      return;
    }
    if (newTimeOff.endDate < newTimeOff.startDate) {
      setError(isRTL ? 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية' : 'End date must be after start date');
      return;
    }
    setError('');
    setTimeOff([
      ...timeOff,
      { id: Date.now().toString(), ...newTimeOff },
    ]);
    setNewTimeOff(emptyTimeOff);
  };

  const removeTimeOff = (id) => {
    setTimeOff(timeOff.filter(t => t.id !== id));
  };

  // ── Save everything together ──
  const handleSave = async () => {
    try {
      setError('');
      setSuccess('');

      // Clean up breaks: drop incomplete entries (missing start or end)
      const cleanBreaks = Object.fromEntries(
        Object.entries(breaks).filter(([, v]) => v?.start && v?.end)
      );

      const doctorRef = doc(db, 'doctors', doctor.id);
      await updateDoc(doctorRef, {
        availability: schedule,
        breaks: cleanBreaks,
        timeOff,
        updatedAt: new Date(),
      });

      setBreaks(cleanBreaks);
      setSuccess(isRTL ? 'تم حفظ الجدول بنجاح!' : 'Schedule saved successfully!');
      if (onUpdate) onUpdate({ availability: schedule, breaks: cleanBreaks, timeOff });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box>
      {/* ── Working Hours ── */}
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

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
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

                    {/* ── Daily break for this working day ── */}
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <FreeBreakfast sx={{ fontSize: 18, color: '#d97706' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {isRTL ? 'وقت الراحة (اختياري)' : 'Break time (optional)'}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      <TextField
                        label={isRTL ? 'من' : 'From'}
                        type="time"
                        size="small"
                        value={breaks[day]?.start || ''}
                        onChange={(e) => setBreakField(day, 'start', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: 140 }}
                      />
                      <TextField
                        label={isRTL ? 'إلى' : 'To'}
                        type="time"
                        size="small"
                        value={breaks[day]?.end || ''}
                        onChange={(e) => setBreakField(day, 'end', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: 140 }}
                      />
                      {breaks[day]?.start && (
                        <IconButton size="small" color="error" onClick={() => removeBreak(day)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      )}
                    </Stack>
                  </>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* ── Time off / Vacation ── */}
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <EventBusy color="error" sx={{ mr: 1, ml: isRTL ? 1 : 0 }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {isRTL ? 'الإجازات وأيام عدم التوفر' : 'Vacation & Time Off'}
          </Typography>
        </Box>

        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
          {isRTL
            ? 'أي تاريخ ضمن هذه الفترات لن يظهر كمتاح للحجز عند المرضى.'
            : 'Dates within these ranges will not appear as bookable to patients.'}
        </Typography>

        {/* Existing time off entries */}
        <Stack spacing={1.5} sx={{ mb: 3 }}>
          {timeOff.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              {isRTL ? 'لا توجد إجازات مضافة' : 'No time off added'}
            </Typography>
          )}
          {timeOff.map((t) => (
            <Paper
              key={t.id}
              variant="outlined"
              sx={{ p: 1.5, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {t.startDate} {t.startDate !== t.endDate ? `→ ${t.endDate}` : ''}
                </Typography>
                {t.reason && (
                  <Typography variant="caption" color="text.secondary">{t.reason}</Typography>
                )}
              </Box>
              <IconButton size="small" color="error" onClick={() => removeTimeOff(t.id)}>
                <Delete fontSize="small" />
              </IconButton>
            </Paper>
          ))}
        </Stack>

        {/* Add new time off */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              label={isRTL ? 'من تاريخ' : 'Start date'}
              type="date"
              size="small"
              fullWidth
              value={newTimeOff.startDate}
              onChange={(e) => setNewTimeOff({ ...newTimeOff, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label={isRTL ? 'إلى تاريخ' : 'End date'}
              type="date"
              size="small"
              fullWidth
              value={newTimeOff.endDate}
              onChange={(e) => setNewTimeOff({ ...newTimeOff, endDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label={isRTL ? 'السبب (اختياري)' : 'Reason (optional)'}
              size="small"
              fullWidth
              value={newTimeOff.reason}
              onChange={(e) => setNewTimeOff({ ...newTimeOff, reason: e.target.value })}
              placeholder={isRTL ? 'مثال: إجازة سنوية' : 'e.g. Annual leave'}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Add />}
              onClick={addTimeOff}
              sx={{ borderRadius: 2 }}
            >
              {isRTL ? 'إضافة' : 'Add'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* ── Save ── */}
      <Box sx={{ textAlign: 'center' }}>
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
    </Box>
  );
}