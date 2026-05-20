import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

const doctorsData = [
  {
    name: "د. أحمد محمد",
    specialty: "قلب وأوعية دموية",
    rating: 4.8,
    reviewsCount: 156,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
    location: "القاهرة - مدينة نصر",
    price: 300,
    bio: "استشاري أمراض القلب بخبرة 15 عاماً، زميل الكلية الملكية البريطانية",
    availability: {
      saturday: ["09:00", "10:00", "11:00", "12:00"],
      sunday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      monday: ["10:00", "11:00", "12:00"],
      tuesday: ["09:00", "10:00", "11:00", "12:00", "14:00"],
      wednesday: ["09:00", "10:00", "11:00"],
      thursday: ["10:00", "11:00", "12:00", "14:00"],
      friday: []
    },
    createdAt: new Date().toISOString()
  },
  {
    name: "د. سارة عبدالله",
    specialty: "جلدية",
    rating: 4.9,
    reviewsCount: 203,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
    location: "القاهرة - المعادي",
    price: 250,
    bio: "أخصائية جلدية وتجميل، خبرة 10 سنوات في علاج الأمراض الجلدية",
    availability: {
      saturday: ["10:00", "11:00", "12:00"],
      sunday: ["10:00", "11:00", "12:00", "15:00"],
      monday: ["09:00", "10:00", "11:00"],
      tuesday: ["10:00", "11:00", "12:00"],
      wednesday: ["09:00", "10:00", "11:00", "12:00"],
      thursday: ["10:00", "11:00"],
      friday: []
    },
    createdAt: new Date().toISOString()
  },
  {
    name: "د. خالد محمود",
    specialty: "عظام",
    rating: 4.6,
    reviewsCount: 89,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
    location: "الجيزة - الدقي",
    price: 200,
    bio: "استشاري جراحة العظام والمفاصل، زميل الجمعية الأمريكية لجراحة العظام",
    availability: {
      saturday: ["09:00", "10:00", "11:00", "12:00", "14:00"],
      sunday: ["09:00", "10:00", "11:00"],
      monday: ["10:00", "11:00", "12:00", "14:00"],
      tuesday: ["09:00", "10:00", "11:00"],
      wednesday: ["10:00", "11:00", "12:00"],
      thursday: ["09:00", "10:00", "11:00", "12:00"],
      friday: []
    },
    createdAt: new Date().toISOString()
  },
  {
    name: "د. نورا حسين",
    specialty: "أسنان",
    rating: 4.7,
    reviewsCount: 134,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400",
    location: "القاهرة - التجمع الخامس",
    price: 400,
    bio: "أخصائية طب وجراحة الفم والأسنان، خبيرة في التجميل والزراعة",
    availability: {
      saturday: ["10:00", "11:00", "12:00", "14:00", "15:00"],
      sunday: ["10:00", "11:00", "12:00"],
      monday: ["09:00", "10:00", "11:00", "12:00"],
      tuesday: ["10:00", "11:00", "12:00", "14:00"],
      wednesday: ["10:00", "11:00", "12:00"],
      thursday: ["09:00", "10:00", "11:00", "12:00", "14:00"],
      friday: []
    },
    createdAt: new Date().toISOString()
  },
  {
    name: "د. يوسف علي",
    specialty: "أطفال",
    rating: 4.9,
    reviewsCount: 267,
    image: "https://images.unsplash.com/photo-1612531386530-97286d74c2ea?w=400",
    location: "الإسكندرية - سموحة",
    price: 180,
    bio: "استشاري طب الأطفال وحديثي الولادة، خبرة 20 عاماً",
    availability: {
      saturday: ["09:00", "10:00", "11:00", "12:00"],
      sunday: ["09:00", "10:00", "11:00"],
      monday: ["10:00", "11:00", "12:00"],
      tuesday: ["09:00", "10:00", "11:00", "12:00"],
      wednesday: ["09:00", "10:00", "11:00"],
      thursday: ["10:00", "11:00", "12:00"],
      friday: []
    },
    createdAt: new Date().toISOString()
  }
];

export async function seedDoctors() {
  try {
    const doctorsRef = collection(db, 'doctors');
    
    for (const doctor of doctorsData) {
      await addDoc(doctorsRef, doctor);
      console.log(`✅ Added: ${doctor.name}`);
    }
    
    console.log('🎉 All doctors added successfully!');
  } catch (error) {
    console.error('❌ Error adding doctors:', error);
  }
}