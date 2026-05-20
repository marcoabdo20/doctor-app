import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase/config';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  doc, 
  updateDoc,
  Timestamp 
} from 'firebase/firestore';

export function useDoctorAppointments(doctorId) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });

  // Fetch appointments function
  const fetchAppointments = useCallback(async () => {
    if (!doctorId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef,
        where('doctorId', '==', doctorId),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const apps = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setAppointments(apps);
      
      // Calculate stats
      const newStats = {
        total: apps.length,
        pending: apps.filter(a => a.status === 'pending').length,
        confirmed: apps.filter(a => a.status === 'confirmed').length,
        completed: apps.filter(a => a.status === 'completed').length,
        cancelled: apps.filter(a => a.status === 'cancelled').length
      };
      setStats(newStats);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  // Initial fetch
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Update appointment status
  const updateStatus = useCallback(async (appointmentId, newStatus) => {
    try {
      const docRef = doc(db, 'appointments', appointmentId);
      await updateDoc(docRef, { 
        status: newStatus,
        updatedAt: Timestamp.now()
      });
      
      // Refresh appointments after update
      await fetchAppointments();
      return { success: true };
    } catch (err) {
      console.error('Error updating status:', err);
      return { success: false, error: err.message };
    }
  }, [fetchAppointments]);

  return { 
    appointments, 
    stats, 
    loading, 
    updateStatus, 
    refresh: fetchAppointments 
  };
}