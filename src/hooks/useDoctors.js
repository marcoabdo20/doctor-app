import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

export function useDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const doctorsRef = collection(db, 'doctors');
        const q = query(doctorsRef, orderBy('rating', 'desc'));
        const snapshot = await getDocs(q);
        
        const doctorsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setDoctors(doctorsList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
  }, []);

  return { doctors, loading, error };
}

// Hook للبحث حسب التخصص
export function useDoctorsBySpecialty(specialty) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const doctorsRef = collection(db, 'doctors');
        const q = query(
          doctorsRef, 
          where('specialty', '==', specialty),
          orderBy('rating', 'desc')
        );
        const snapshot = await getDocs(q);
        
        const doctorsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setDoctors(doctorsList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (specialty) {
      fetchDoctors();
    }
  }, [specialty]);

  return { doctors, loading };
}