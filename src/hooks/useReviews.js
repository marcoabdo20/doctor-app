import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase/config';
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    orderBy,
    Timestamp,
    doc,
    updateDoc
} from 'firebase/firestore';

export function useReviews(doctorId) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [averageRating, setAverageRating] = useState(0);

    const fetchReviews = useCallback(async () => {
        if (!doctorId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const reviewsRef = collection(db, 'reviews');
            const q = query(
                reviewsRef,
                where('doctorId', '==', doctorId),
                orderBy('createdAt', 'desc')
            );

            const snapshot = await getDocs(q);
            const reviewsList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setReviews(reviewsList);

            // حساب متوسط التقييم
            if (reviewsList.length > 0) {
                const total = reviewsList.reduce((sum, r) => sum + (r.rating || 0), 0);
                setAverageRating(Number((total / reviewsList.length).toFixed(1)));
            } else {
                setAverageRating(0);
            }
        } catch (err) {
            console.error('Error fetching reviews:', err);
        } finally {
            setLoading(false);
        }
    }, [doctorId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    return { reviews, loading, averageRating, refresh: fetchReviews };
}

// إضافة تقييم جديد
export async function addReview(reviewData) {
    try {
        const reviewsRef = collection(db, 'reviews');
        const docRef = await addDoc(reviewsRef, {
            ...reviewData,
            createdAt: Timestamp.now(),
        });

        // تحديث تقييم الطبيب
        await updateDoctorRating(reviewData.doctorId);

        return { success: true, reviewId: docRef.id };
    } catch (err) {
        console.error('Error adding review:', err);
        return { success: false, error: err.message };
    }
}

// تحديث تقييم الطبيب
async function updateDoctorRating(doctorId) {
    try {
        const reviewsRef = collection(db, 'reviews');
        const q = query(reviewsRef, where('doctorId', '==', doctorId));
        const snapshot = await getDocs(q);

        const reviews = snapshot.docs.map((doc) => doc.data());
        const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
        const average = reviews.length > 0 ? Number((totalRating / reviews.length).toFixed(1)) : 0;

        const doctorRef = doc(db, 'doctors', doctorId);
        await updateDoc(doctorRef, {
            rating: average,
            reviewsCount: reviews.length,
        });
    } catch (err) {
        console.error('Error updating doctor rating:', err);
    }
}