
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Types de langues supportées
type Language = 'fr' | 'ar';

// Structure pour les traductions
type Translations = {
  [key: string]: {
    fr: string;
    ar: string;
  };
};

// Contexte pour les traductions
interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

// Traductions de base
const translations: Translations = {
  // Navigation
  'nav.home': {
    fr: 'Accueil',
    ar: 'الرئيسية'
  },
  'nav.appointments': {
    fr: 'Rendez-vous',
    ar: 'المواعيد'
  },
  'nav.services': {
    fr: 'Services',
    ar: 'الخدمات'
  },
  'nav.shop': {
    fr: 'Boutique',
    ar: 'متجر'
  },
  'nav.doctors': {
    fr: 'Médecins',
    ar: 'الأطباء'
  },
  'nav.profile': {
    fr: 'Profil',
    ar: 'الملف الشخصي'
  },
  
  // Authentication
  'auth.login': {
    fr: 'Connexion',
    ar: 'تسجيل الدخول'
  },
  'auth.signup': {
    fr: 'Inscription',
    ar: 'التسجيل'
  },
  'auth.phoneNumber': {
    fr: 'Numéro de téléphone',
    ar: 'رقم الهاتف'
  },
  'auth.or': {
    fr: 'ou',
    ar: 'أو'
  },
  'auth.continueWithGoogle': {
    fr: 'Continuer avec Google',
    ar: 'المتابعة بحساب Google'
  },
  'auth.forgotPassword': {
    fr: 'Mot de passe oublié ?',
    ar: 'نسيت كلمة المرور؟'
  },
  
  // Home page
  'home.welcome': {
    fr: 'Bienvenue sur SIHATI',
    ar: 'مرحبًا بكم في صحتي'
  },
  'home.tagline': {
    fr: 'Votre santé, notre priorité',
    ar: 'صحتك، أولويتنا'
  },
  'home.findServices': {
    fr: 'Trouvez les services dont vous avez besoin',
    ar: 'ابحث عن الخدمات التي تحتاجها'
  },
  'home.appointments': {
    fr: 'Rendez-vous et téléconsultations',
    ar: 'المواعيد والاستشارات عن بعد'
  },
  'home.homecare': {
    fr: 'Soins à domicile',
    ar: 'الرعاية المنزلية'
  },
  'home.emergency': {
    fr: 'Services d\'urgence',
    ar: 'خدمات الطوارئ'
  },
  'home.moreServices': {
    fr: 'Autres services',
    ar: 'خدمات أخرى'
  },
  'home.quickAccess': {
    fr: 'Accès rapide',
    ar: 'وصول سريع'
  },
  
  // Services
  'services.homecare': {
    fr: 'Soins à domicile',
    ar: 'الرعاية المنزلية'
  },
  'services.homecareDesc': {
    fr: 'Des soins médicaux professionnels dans le confort de votre domicile.',
    ar: 'رعاية طبية احترافية في راحة منزلك.'
  },
  'services.physiotherapy': {
    fr: 'Kinésithérapie',
    ar: 'العلاج الطبيعي'
  },
  'services.physiotherapyDesc': {
    fr: 'Séances de kinésithérapie à domicile par des professionnels certifiés.',
    ar: 'جلسات العلاج الطبيعي في المنزل من قبل متخصصين معتمدين.'
  },
  'services.emergency': {
    fr: 'Urgences à domicile',
    ar: 'الطوارئ المنزلية'
  },
  'services.emergencyDesc': {
    fr: 'Intervention médicale rapide à votre domicile en cas d\'urgence.',
    ar: 'تدخل طبي سريع في منزلك في حالات الطوارئ.'
  },
  'services.ambulance': {
    fr: 'Ambulance',
    ar: 'سيارة إسعاف'
  },
  'services.ambulanceDesc': {
    fr: 'Service d\'ambulance rapide avec suivi en temps réel.',
    ar: 'خدمة إسعاف سريعة مع تتبع في الوقت الحقيقي.'
  },
  'services.appointment': {
    fr: 'Prendre rendez-vous',
    ar: 'حجز موعد'
  },
  'services.appointmentDesc': {
    fr: 'Planifiez vos rendez-vous avec nos professionnels de santé.',
    ar: 'جدولة مواعيدك مع متخصصينا الصحيين.'
  },
  'services.teleconsultation': {
    fr: 'Téléconsultation',
    ar: 'الاستشارة عن بعد'
  },
  'services.teleconsultationDesc': {
    fr: 'Consultez un médecin par vidéo sans vous déplacer.',
    ar: 'استشر طبيبًا عبر الفيديو دون الحاجة للتنقل.'
  },
  'services.bloodTest': {
    fr: 'Prises de sang',
    ar: 'تحاليل الدم'
  },
  'services.bloodTestDesc': {
    fr: 'Service de prélèvement sanguin à domicile par des infirmiers qualifiés.',
    ar: 'خدمة سحب الدم في المنزل من قبل ممرضين مؤهلين.'
  },
  'services.nursing': {
    fr: 'Soins infirmiers',
    ar: 'الرعاية التمريضية'
  },
  'services.nursingDesc': {
    fr: 'Services infirmiers à domicile pour tous types de soins.',
    ar: 'خدمات التمريض في المنزل لجميع أنواع الرعاية.'
  },
  'services.doctors': {
    fr: 'Annuaire des médecins',
    ar: 'دليل الأطباء'
  },
  'services.doctorsDesc': {
    fr: 'Trouvez le bon spécialiste pour votre besoin.',
    ar: 'اعثر على المتخصص المناسب لاحتياجاتك.'
  },
  'services.pharmacy': {
    fr: 'Pharmacie en ligne',
    ar: 'صيدلية عبر الإنترنت'
  },
  'services.pharmacyDesc': {
    fr: 'Commandez vos médicaments et produits de santé en ligne.',
    ar: 'اطلب أدويتك ومنتجات الصحة عبر الإنترنت.'
  },
  'services.nearbyProfessionals': {
    fr: 'Professionnels à proximité',
    ar: 'المتخصصون القريبون'
  },
  
  // Appointments
  'appointments.book': {
    fr: 'Prendre rendez-vous',
    ar: 'حجز موعد'
  },
  'appointments.bookDesc': {
    fr: 'Planifiez votre prochain rendez-vous',
    ar: 'جدولة موعدك القادم'
  },
  'appointments.upcoming': {
    fr: 'Rendez-vous à venir',
    ar: 'المواعيد القادمة'
  },
  'appointments.past': {
    fr: 'Rendez-vous passés',
    ar: 'المواعيد السابقة'
  },
  'appointments.date': {
    fr: 'Date',
    ar: 'التاريخ'
  },
  'appointments.time': {
    fr: 'Heure',
    ar: 'الوقت'
  },
  'appointments.type': {
    fr: 'Type',
    ar: 'النوع'
  },
  
  // Shop
  'shop.products': {
    fr: 'Produits médicaux',
    ar: 'المنتجات الطبية'
  },
  'shop.productsDesc': {
    fr: 'Parcourez notre boutique médicale',
    ar: 'تصفح متجرنا الطبي'
  },
  'shop.services': {
    fr: 'Services premium',
    ar: 'الخدمات المميزة'
  },
  'shop.cart': {
    fr: 'Panier',
    ar: 'سلة التسوق'
  },
  'shop.checkout': {
    fr: 'Paiement',
    ar: 'الدفع'
  },
  
  // Doctors directory
  'doctors.directory': {
    fr: 'Annuaire des médecins',
    ar: 'دليل الأطباء'
  },
  'doctors.directoryDesc': {
    fr: 'Trouvez le bon spécialiste',
    ar: 'اعثر على المتخصص المناسب'
  },
  'doctors.specialty': {
    fr: 'Spécialité',
    ar: 'التخصص'
  },
  'doctors.location': {
    fr: 'Emplacement',
    ar: 'الموقع'
  },
  'doctors.availability': {
    fr: 'Disponibilité',
    ar: 'التوفر'
  },
  
  // General
  'general.search': {
    fr: 'Rechercher',
    ar: 'بحث'
  },
  'general.loading': {
    fr: 'Chargement...',
    ar: 'جاري التحميل...'
  },
  'general.back': {
    fr: 'Retour',
    ar: 'رجوع'
  },
  'general.close': {
    fr: 'Fermer',
    ar: 'إغلاق'
  },
  'general.save': {
    fr: 'Enregistrer',
    ar: 'حفظ'
  },
  'general.cancel': {
    fr: 'Annuler',
    ar: 'إلغاء'
  },
  'general.continue': {
    fr: 'Continuer',
    ar: 'متابعة'
  },
  'general.language': {
    fr: 'Langue',
    ar: 'اللغة'
  }
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');
  const isRTL = language === 'ar';
  
  useEffect(() => {
    // Appliquer la direction RTL au document si la langue est l'arabe
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    
    // Stocker la préférence de langue
    localStorage.setItem('language', language);
  }, [language, isRTL]);
  
  // Récupérer la valeur traduite pour une clé donnée
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language];
  };
  
  return (
    <TranslationContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  
  return context;
};
