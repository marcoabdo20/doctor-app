import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

// ─── كل الدكاترة ───────────────────────────────────────────────────────────
export function useDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const doctorsRef = collection(db, 'doctors');
        const q = query(doctorsRef, orderBy('rating', 'desc'));  // ✅ بدون space
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

// ─── دكاترة حسب التخصص ──────────────────────────────────────────────────────
export function useDoctorsBySpecialty(specialty) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        setLoading(true);
        setError(null);
        
        const doctorsRef = collection(db, 'doctors');
        
        // ← ← ← الحل السريع: بدون orderBy عشان مفيش index
        const q = query(
          doctorsRef, 
          where('specialty', '==', specialty)
        );
        
        const snapshot = await getDocs(q);
        
        const doctorsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // فرز client-side بدون Firestore index
        doctorsList.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        
        console.log('✅ Found:', doctorsList.length, 'for', specialty);
        setDoctors(doctorsList);
      } catch (err) {
        console.error('❌ Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (specialty && specialty !== 'All') {
      fetchDoctors();
    } else {
      setDoctors([]);
      setLoading(false);
    }
  }, [specialty]);

  return { doctors, loading, error };
}