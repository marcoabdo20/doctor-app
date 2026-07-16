import { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  db 
} from '../firebase/config';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with role
  async function signup(email, password, name, role = 'patient', extraData = {}) {
    try {
      // 1. إنشاء المستخدم في Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. تحديث الاسم في Auth
      await updateProfile(user, { displayName: name });

      // 3. حفظ بيانات المستخدم في Firestore
      // ⚠️ مهم: نستخدم user.uid اللي رجع من Auth
      const userData = {
        name: name,
        email: email,
        role: role,
        phone: extraData.phone || '',
        createdAt: serverTimestamp(),
        ...extraData
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      // 4. لو دكتور، أنشئ ملفه
      if (role === 'doctor') {
        const doctorData = {
          id: user.uid,
          name: `Dr. ${name}`,
          email: email,
          specialty: extraData.specialty || 'General',
          rating: 0,
          reviewsCount: 0,
          image: extraData.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
          location: extraData.location || 'Cairo',
          price: extraData.price || 200,
          bio: extraData.bio || `Dr. ${name} is a specialist in ${extraData.specialty || 'General Medicine'}.`,
          availability: {
            saturday: ['09:00', '10:00', '11:00', '12:00'],
            sunday: ['09:00', '10:00', '11:00', '14:00', '15:00'],
            monday: ['10:00', '11:00', '12:00'],
            tuesday: ['09:00', '10:00', '11:00', '12:00', '14:00'],
            wednesday: ['09:00', '10:00', '11:00'],
            thursday: ['10:00', '11:00', '12:00', '14:00'],
            friday: []
          },
          createdAt: serverTimestamp()
        };

        await setDoc(doc(db, 'doctors', user.uid), doctorData);
      }

      return user;
    } catch (error) {
      console.error("Signup error:", error.code, error.message);
      throw error;
    }
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          } else {
            console.warn("User document not found for uid:", user.uid);
            setUserRole(null);
          }
        } catch (error) {
          console.error("Error fetching user role:", error.code, error.message);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    signup,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}