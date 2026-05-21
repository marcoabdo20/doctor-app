
import { createContext, useContext, useState } from 'react';

const translations = {
  ar: {
    // General
    appName: 'حجز مواعيد الأطباء',
    welcome: 'مرحباً',
    login: 'تسجيل الدخول',
    signup: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    name: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    submit: 'إرسال',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    save: 'حفظ',
    edit: 'تعديل',
    delete: 'حذف',
    search: 'بحث',
    filter: 'فلترة',
    loading: 'جاري التحميل...',
    noData: 'لا توجد بيانات',
    error: 'حدث خطأ',
    success: 'تم بنجاح',

    // Roles
    patient: 'مريض',
    doctor: 'طبيب',
    admin: 'مدير',

    // Navigation
    home: 'الرئيسية',
    doctors: 'الأطباء',
    appointments: 'مواعيدي',
    dashboard: 'لوحة التحكم',
    profile: 'الملف الشخصي',

    // Home Page
    heroTitle: 'احجز موعدك مع أفضل الأطباء',
    heroSubtitle: 'نظام حجز مواعيد طبية سهل وسريع مع تقييمات حقيقية من المرضى',
    findDoctor: 'ابحث عن طبيب',
    createAccount: 'إنشاء حساب',
    whyChooseUs: 'لماذا تختار منصتنا؟',
    expertDoctors: 'أطباء متخصصون',
    expertDoctorsDesc: 'مجموعة واسعة من الأطباء في جميع التخصصات',
    instantBooking: 'حجز فوري',
    instantBookingDesc: 'احجز موعدك بخطوات بسيطة وفي أي وقت',
    trustedReviews: 'تقييمات موثوقة',
    trustedReviewsDesc: 'رؤية تقييمات حقيقية من مرضى سابقين',
    howItWorks: 'كيف يعمل',
    step1: 'ابحث',
    step1Desc: 'ابحث عن الأطباء حسب التخصص أو الموقع أو الاسم',
    step2: 'اختر',
    step2Desc: 'شاهد الملفات الشخصية والتقييمات واختر طبيبك',
    step3: 'احجز',
    step3Desc: 'اختر التاريخ والوقت المناسبين لك',
    step4: 'زور',
    step4Desc: 'حضر موعدك واحصل على الرعاية الطبية',

    // Doctors Page
    findYourDoctor: 'ابحث عن طبيبك',
    specialty: 'التخصص',
    location: 'الموقع',
    price: 'السعر',
    rating: 'التقييم',
    reviews: 'تقييمات',
    bookNow: 'احجز الآن',
    noDoctorsFound: 'لم يتم العثور على أطباء',

    // Doctor Details
    aboutDoctor: 'نبذة عن الطبيب',
    schedule: 'المواعيد',
    bookAppointment: 'حجز موعد',
    yearsExperience: 'سنوات خبرة',
    patientsCount: 'عدد المرضى',

    // Booking
    selectDate: 'اختر التاريخ',
    selectTime: 'اختر الوقت',
    confirmBooking: 'تأكيد الحجز',
    bookingSuccess: 'تم الحجز بنجاح!',
    bookingPending: 'في انتظار التأكيد',

    // Appointments
    myAppointments: 'مواعيدي',
    upcoming: 'القادمة',
    completed: 'المكتملة',
    cancelled: 'الملغاة',
    status: 'الحالة',
    date: 'التاريخ',
    time: 'الوقت',
    doctorName: 'اسم الطبيب',
    cancelAppointment: 'إلغاء الموعد',
    writeReview: 'كتابة تقييم',

    // Doctor Dashboard
    totalPatients: 'إجمالي المرضى',
    pendingAppointments: 'مواعيد معلقة',
    confirmedAppointments: 'مواعيد مؤكدة',
    completedAppointments: 'مواعيد مكتملة',
    reject: 'رفض',
    markComplete: 'تحديد كمكتمل',

    // Reviews
    yourRating: 'تقييمك',
    yourReview: 'مراجعتك',
    submitReview: 'إرسال التقييم',
    noReviews: 'لا توجد تقييمات بعد',

    // Auth
    loginTitle: 'تسجيل الدخول',
    signupTitle: 'إنشاء حساب جديد',
    haveAccount: 'لديك حساب؟',
    noAccount: 'ليس لديك حساب؟',
    forgotPassword: 'نسيت كلمة المرور؟',

    // Footer
    contact: 'تواصل معنا',
    quickLinks: 'روابط سريعة',
    allRightsReserved: 'جميع الحقوق محفوظة',
  },

  en: {
    // General
    appName: 'Doctor Appointment Booking',
    welcome: 'Welcome',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    name: 'Full Name',
    phone: 'Phone Number',
    submit: 'Submit',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search',
    filter: 'Filter',
    loading: 'Loading...',
    noData: 'No data available',
    error: 'An error occurred',
    success: 'Success',

    // Roles
    patient: 'Patient',
    doctor: 'Doctor',
    admin: 'Admin',

    // Navigation
    home: 'Home',
    doctors: 'Doctors',
    appointments: 'My Appointments',
    dashboard: 'Dashboard',
    profile: 'Profile',

    // Home Page
    heroTitle: 'Book Your Doctor Appointment Online',
    heroSubtitle: 'Easy and fast medical appointment booking system with real patient reviews',
    findDoctor: 'Find a Doctor',
    createAccount: 'Create Account',
    whyChooseUs: 'Why Choose Us?',
    expertDoctors: 'Expert Doctors',
    expertDoctorsDesc: 'Wide range of doctors across all specialties',
    instantBooking: 'Instant Booking',
    instantBookingDesc: 'Book your appointment in simple steps, anytime anywhere',
    trustedReviews: 'Trusted Reviews',
    trustedReviewsDesc: 'See real reviews and ratings from previous patients',
    howItWorks: 'How It Works',
    step1: 'Search',
    step1Desc: 'Find doctors by specialty, location, or name',
    step2: 'Choose',
    step2Desc: 'View profiles, ratings, and select your doctor',
    step3: 'Book',
    step3Desc: 'Pick a date and time that works for you',
    step4: 'Visit',
    step4Desc: 'Attend your appointment and get care',

    // Doctors Page
    findYourDoctor: 'Find Your Doctor',
    specialty: 'Specialty',
    location: 'Location',
    price: 'Price',
    rating: 'Rating',
    reviews: 'Reviews',
    bookNow: 'Book Now',
    noDoctorsFound: 'No doctors found',

    // Doctor Details
    aboutDoctor: 'About Doctor',
    schedule: 'Schedule',
    bookAppointment: 'Book Appointment',
    yearsExperience: 'Years Experience',
    patientsCount: 'Patients Count',

    // Booking
    selectDate: 'Select Date',
    selectTime: 'Select Time',
    confirmBooking: 'Confirm Booking',
    bookingSuccess: 'Booking Successful!',
    bookingPending: 'Pending Confirmation',

    // Appointments
    myAppointments: 'My Appointments',
    upcoming: 'Upcoming',
    completed: 'Completed',
    cancelled: 'Cancelled',
    status: 'Status',
    date: 'Date',
    time: 'Time',
    doctorName: 'Doctor Name',
    cancelAppointment: 'Cancel Appointment',
    writeReview: 'Write Review',

    // Doctor Dashboard
    totalPatients: 'Total Patients',
    pendingAppointments: 'Pending Appointments',
    confirmedAppointments: 'Confirmed Appointments',
    completedAppointments: 'Completed Appointments',
    reject: 'Reject',
    markComplete: 'Mark Complete',

    // Reviews
    yourRating: 'Your Rating',
    yourReview: 'Your Review',
    submitReview: 'Submit Review',
    noReviews: 'No reviews yet',

    // Auth
    loginTitle: 'Login',
    signupTitle: 'Create New Account',
    haveAccount: 'Already have an account?',
    noAccount: "Don't have an account?",
    forgotPassword: 'Forgot Password?',

    // Footer
    contact: 'Contact Us',
    quickLinks: 'Quick Links',
    allRightsReserved: 'All Rights Reserved',
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'ar');

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
    document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}