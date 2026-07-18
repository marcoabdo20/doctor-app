import { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, doc, getDoc, setDoc, arrayUnion, Timestamp } from 'firebase/firestore';

export function useBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if time slot is available by reading the lightweight bookedSlots doc
  // (doctors/{doctorId}_{date} -> { times: [...] }) instead of querying the
  // full appointments collection, which patients aren't allowed to list.
  async function isTimeSlotAvailable(doctorId, date, time) {
    const slotDocId = `${doctorId}_${date}`;
    const slotSnap = await getDoc(doc(db, 'bookedSlots', slotDocId));
    const bookedTimes = slotSnap.exists() ? (slotSnap.data().times || []) : [];
    return !bookedTimes.includes(time); // true if not already taken
  }

  // Create new appointment
  async function bookAppointment(appointmentData) {
    try {
      setLoading(true);
      setError(null);

      // Check availability first
      const isAvailable = await isTimeSlotAvailable(
        appointmentData.doctorId,
        appointmentData.date,
        appointmentData.time
      );

      if (!isAvailable) {
        throw new Error('This time slot is already booked');
      }

      // Add appointment
      const appointmentsRef = collection(db, 'appointments');
      const docRef = await addDoc(appointmentsRef, {
        ...appointmentData,
        status: 'pending',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      // Mark the slot as taken so other patients can't double-book it.
      // Non-fatal if this fails; the appointment itself already succeeded.
      try {
        const slotDocId = `${appointmentData.doctorId}_${appointmentData.date}`;
        await setDoc(
          doc(db, 'bookedSlots', slotDocId),
          {
            doctorId: appointmentData.doctorId,
            date: appointmentData.date,
            times: arrayUnion(appointmentData.time),
          },
          { merge: true }
        );
      } catch (slotErr) {
        console.error('Error updating bookedSlots:', slotErr);
      }

      setLoading(false);
      return { success: true, appointmentId: docRef.id };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  }

  return { bookAppointment, isTimeSlotAvailable, loading, error };
}