import { db } from './firebase/config';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Get doctor's availability schedule
 * @param {string} doctorId 
 * @returns {Promise<Object|null>}
 */
export async function getDoctorAvailability(doctorId) {
  try {
    const docRef = doc(db, 'doctors', doctorId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.availability || null;
    }
    return null;
  } catch (err) {
    console.error('Error fetching availability:', err);
    return null;
  }
}

/**
 * Get booked time slots for a specific date
 * @param {string} doctorId 
 * @param {string} dateStr - YYYY-MM-DD
 * @returns {Promise<string[]>} - Array of booked times
 */
export async function getBookedSlots(doctorId, dateStr) {
  try {
    const q = query(
      collection(db, 'appointments'),
      where('doctorId', '==', doctorId),
      where('date', '==', dateStr),
      where('status', 'in', ['pending', 'confirmed'])
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data().time);
  } catch (err) {
    console.error('Error fetching booked slots:', err);
    return [];
  }
}

/**
 * Check if a time slot is available
 * @param {string} doctorId 
 * @param {string} dateStr 
 * @param {string} timeStr 
 * @returns {Promise<boolean>}
 */
export async function isSlotAvailable(doctorId, dateStr, timeStr) {
  const booked = await getBookedSlots(doctorId, dateStr);
  return !booked.includes(timeStr);
}

/**
 * Get available slots for a specific day
 * @param {Object} availability - Doctor's availability object
 * @param {string} dayName - e.g. 'monday'
 * @param {string[]} bookedSlots - Already booked times
 * @returns {string[]} - Available time slots
 */
export function getAvailableSlotsForDay(availability, dayName, bookedSlots = []) {
  const dayConfig = availability?.[dayName];
  if (!dayConfig?.enabled || !dayConfig.slots) return [];

  const allSlots = [];
  dayConfig.slots.forEach(slot => {
    let [h, m] = slot.start.split(':').map(Number);
    const [endH, endM] = slot.end.split(':').map(Number);

    while (h < endH || (h === endH && m < endM)) {
      const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      if (!bookedSlots.includes(timeStr)) {
        allSlots.push(timeStr);
      }
      m += 30;
      if (m >= 60) { m = 0; h++; }
    }
  });

  return allSlots;
}