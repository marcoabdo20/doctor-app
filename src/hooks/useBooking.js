import { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';

export function useBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if time slot is available
  async function isTimeSlotAvailable(doctorId, date, time) {
    const appointmentsRef = collection(db, 'appointments');
    const q = query(
      appointmentsRef,
      where('doctorId', '==', doctorId),
      where('date', '==', date),
      where('time', '==', time),
      where('status', 'in', ['pending', 'confirmed'])
    );
    
    const snapshot = await getDocs(q);
    return snapshot.empty; // true if no appointments found
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