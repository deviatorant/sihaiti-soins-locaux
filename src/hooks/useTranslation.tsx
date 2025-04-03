
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
  
  // Services
  'services.homecare': {
    fr: 'Soins à domicile',
    ar: 'الرعاية المنزلية'
  },
  'services.physiotherapy': {
    fr: 'Kinésithérapie',
    ar: 'العلاج الطبيعي'
  },
  'services.emergency': {
    fr: 'Urgences à domicile',
    ar: 'الطوارئ المنزلية'
  },
  'services.ambulance': {
    fr: 'Ambulance',
    ar: 'سيارة إسعاف'
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
