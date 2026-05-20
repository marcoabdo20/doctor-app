import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

const specialtiesData = [
  {
    name: "قلب وأوعية دموية",
    icon: "favorite",
    description: "تشخيص وعلاج أمراض القلب والأوعية الدموية",
    doctorsCount: 1
  },
  {
    name: "جلدية",
    icon: "spa",
    description: "علاج الأمراض الجلدية والتجميل",
    doctorsCount: 1
  },
  {
    name: "عظام",
    icon: "accessibility",
    description: "جراحة العظام والمفاصل والعمود الفقري",
    doctorsCount: 1
  },
  {
    name: "أسنان",
    icon: "medical_services",
    description: "طب وجراحة الفم والأسنان",
    doctorsCount: 1
  },
  {
    name: "أطفال",
    icon: "child_care",
    description: "طب الأطفال وحديثي الولادة",
    doctorsCount: 1
  },
  {
    name: "عيون",
    icon: "visibility",
    description: "طب وجراحة العيون",
    doctorsCount: 0
  }
];

export async function seedSpecialties() {
  try {
    const specialtiesRef = collection(db, 'specialties');
    
    for (const specialty of specialtiesData) {
      await addDoc(specialtiesRef, specialty);
      console.log(`✅ Added: ${specialty.name}`);
    }
    
    console.log('🎉 All specialties added successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}