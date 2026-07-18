// scheduleUtils.js
// Shared helpers for computing a doctor's real availability
// (working hours minus breaks minus vacation/time-off minus already-booked slots)

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

/**
 * Returns the schedule day-key (e.g. 'saturday') for a given date string 'YYYY-MM-DD'.
 */
export function getDayKey(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`);
  return DAY_KEYS[date.getDay()];
}

/**
 * Returns true if the given date falls inside any of the doctor's time-off ranges.
 * doctor.timeOff: [{ startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', reason }]
 */
export function isDateOff(doctor, dateStr) {
  if (!doctor?.timeOff?.length) return false;
  return doctor.timeOff.some(
    (t) => dateStr >= t.startDate && dateStr <= t.endDate
  );
}

/**
 * Returns the doctor's break window for a given date, or null if there isn't one.
 * doctor.breaks: { saturday: { start: '13:00', end: '14:00' }, ... }
 */
export function getBreakForDate(doctor, dateStr) {
  const dayKey = getDayKey(dateStr);
  return doctor?.breaks?.[dayKey] || null;
}

/**
 * Main function: given a doctor and a date, return the list of hour strings
 * ('09:00', '10:00', ...) that are actually bookable by a patient.
 *
 * @param {object} doctor - doctor document (must include availability, breaks, timeOff)
 * @param {string} dateStr - 'YYYY-MM-DD'
 * @param {string[]} bookedTimes - hours already taken by other appointments on that date
 */
export function getAvailableSlots(doctor, dateStr, bookedTimes = []) {
  if (!doctor || !dateStr) return [];

  // Whole day is off (vacation / leave)
  if (isDateOff(doctor, dateStr)) return [];

  const dayKey = getDayKey(dateStr);
  const hours = doctor.availability?.[dayKey] || [];
  const brk = doctor.breaks?.[dayKey];

  return hours.filter((hour) => {
    if (bookedTimes.includes(hour)) return false;
    if (brk?.start && brk?.end && hour >= brk.start && hour < brk.end) return false;
    return true;
  });
}

/**
 * Convenience check for disabling a whole date in a date-picker
 * (e.g. Sundays with no working hours, or days fully inside a time-off range).
 */
export function isDateBookable(doctor, dateStr) {
  if (!doctor) return false;
  if (isDateOff(doctor, dateStr)) return false;
  const dayKey = getDayKey(dateStr);
  return (doctor.availability?.[dayKey]?.length || 0) > 0;
}