
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
  'nav.pharmacy': {
    fr: 'Pharmacie',
    ar: 'صيدلية'
  },
  'nav.homecare': {
    fr: 'Soins à domicile',
    ar: 'الرعاية المنزلية'
  },
  'nav.teleconsultation': {
    fr: 'Téléconsultation',
    ar: 'الاستشارة عن بعد'
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
  'auth.firstName': {
    fr: 'Prénom',
    ar: 'الاسم الأول'
  },
  'auth.lastName': {
    fr: 'Nom',
    ar: 'اسم العائلة'
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
  'auth.continueAsGuest': {
    fr: 'Continuer en tant qu\'invité',
    ar: 'المتابعة كضيف'
  },
  'auth.forgotPassword': {
    fr: 'Mot de passe oublié ?',
    ar: 'نسيت كلمة المرور؟'
  },
  'auth.alreadyHaveAccount': {
    fr: 'Vous avez déjà un compte ?',
    ar: 'هل لديك حساب بالفعل؟'
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
  'services.title': {
    fr: 'Nos Services Médicaux',
    ar: 'خدماتنا الطبية'
  },
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
  'services.moreServices': {
    fr: 'Autres services',
    ar: 'خدمات أخرى'
  },
  'services.book': {
    fr: 'Réserver',
    ar: 'حجز'
  },
  'services.bookingSuccess': {
    fr: 'Votre demande a été envoyée avec succès !',
    ar: 'تم إرسال طلبك بنجاح!'
  },
  
  // Appointments
  'appointments.title': {
    fr: 'Mes Rendez-vous',
    ar: 'مواعيدي'
  },
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
  'appointments.confirmed': {
    fr: 'Confirmé',
    ar: 'مؤكد'
  },
  'appointments.completed': {
    fr: 'Terminé',
    ar: 'منتهي'
  },
  'appointments.cancelled': {
    fr: 'Annulé',
    ar: 'ملغى'
  },
  'appointments.inPerson': {
    fr: 'En personne',
    ar: 'حضوري'
  },
  'appointments.video': {
    fr: 'Vidéo',
    ar: 'فيديو'
  },
  'appointments.cancel': {
    fr: 'Annuler',
    ar: 'إلغاء'
  },
  'appointments.searchDoctor': {
    fr: 'Rechercher un médecin',
    ar: 'البحث عن طبيب'
  },
  'appointments.searchPlaceholder': {
    fr: 'Nom, spécialité ou lieu...',
    ar: 'الاسم، التخصص أو الموقع...'
  },
  'appointments.specialty': {
    fr: 'Spécialité',
    ar: 'التخصص'
  },
  'appointments.allSpecialties': {
    fr: 'Toutes les spécialités',
    ar: 'جميع التخصصات'
  },
  'appointments.specialties.cardiologist': {
    fr: 'Cardiologue',
    ar: 'طبيب القلب'
  },
  'appointments.specialties.dermatologist': {
    fr: 'Dermatologue',
    ar: 'طبيب الجلدية'
  },
  'appointments.specialties.gp': {
    fr: 'Médecin généraliste',
    ar: 'طبيب عام'
  },
  'appointments.specialties.pediatrician': {
    fr: 'Pédiatre',
    ar: 'طبيب الأطفال'
  },
  'appointments.selectType': {
    fr: 'Sélectionner un type',
    ar: 'اختر النوع'
  },
  'appointments.availableDoctors': {
    fr: 'Médecins disponibles',
    ar: 'الأطباء المتاحون'
  },
  'appointments.noDoctorsFound': {
    fr: 'Aucun médecin trouvé pour ces critères',
    ar: 'لم يتم العثور على أطباء لهذه المعايير'
  },
  'appointments.scheduleNew': {
    fr: 'Planifier un nouveau rendez-vous',
    ar: 'تحديد موعد جديد'
  },
  'appointments.selectDate': {
    fr: 'Sélectionner une date',
    ar: 'اختر تاريخًا'
  },
  'appointments.selectTime': {
    fr: 'Sélectionner une heure',
    ar: 'اختر وقتًا'
  },
  'appointments.selectTimeSlot': {
    fr: 'Cliquez sur un créneau horaire',
    ar: 'انقر على فترة زمنية'
  },
  'appointments.notesPlaceholder': {
    fr: 'Raison de la consultation, symptômes, questions...',
    ar: 'سبب الاستشارة، الأعراض، الأسئلة...'
  },
  'appointments.confirmBooking': {
    fr: 'Confirmer la réservation',
    ar: 'تأكيد الحجز'
  },
  'appointments.noUpcoming': {
    fr: 'Vous n\'avez pas de rendez-vous à venir',
    ar: 'ليس لديك مواعيد قادمة'
  },
  'appointments.noPast': {
    fr: 'Vous n\'avez pas de rendez-vous passés',
    ar: 'ليس لديك مواعيد سابقة'
  },
  'appointments.bookNew': {
    fr: 'Prendre un nouveau rendez-vous',
    ar: 'حجز موعد جديد'
  },
  'appointments.availableToday': {
    fr: 'Disponible aujourd\'hui',
    ar: 'متاح اليوم'
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
  
  // Teleconsultation
  'teleconsultation.video': {
    fr: 'Vidéo',
    ar: 'فيديو'
  },
  'teleconsultation.audio': {
    fr: 'Audio',
    ar: 'صوت'
  },
  'teleconsultation.message': {
    fr: 'Message',
    ar: 'رسالة'
  },
  'teleconsultation.videoTitle': {
    fr: 'Consultation vidéo',
    ar: 'استشارة بالفيديو'
  },
  'teleconsultation.videoDescription': {
    fr: 'Consultez un médecin par vidéo pour un diagnostic visuel complet',
    ar: 'استشر طبيبًا عبر الفيديو للحصول على تشخيص بصري كامل'
  },
  'teleconsultation.audioTitle': {
    fr: 'Consultation audio',
    ar: 'استشارة صوتية'
  },
  'teleconsultation.audioDescription': {
    fr: 'Consultez un médecin par appel audio si vous préférez plus de confidentialité',
    ar: 'استشر طبيبًا عبر مكالمة صوتية إذا كنت تفضل المزيد من الخصوصية'
  },
  'teleconsultation.messageTitle': {
    fr: 'Consultation par message',
    ar: 'استشارة عبر الرسائل'
  },
  'teleconsultation.messageDescription': {
    fr: 'Consultez un médecin par message texte si vous préférez communiquer par écrit',
    ar: 'استشر طبيبًا عبر الرسائل النصية إذا كنت تفضل التواصل كتابيًا'
  },
  'teleconsultation.cameraPlaceholder': {
    fr: 'La caméra s\'activera lors de la consultation',
    ar: 'سيتم تفعيل الكاميرا أثناء الاستشارة'
  },
  'teleconsultation.audioPlaceholder': {
    fr: 'L\'audio s\'activera lors de la consultation',
    ar: 'سيتم تفعيل الصوت أثناء الاستشارة'
  },
  'teleconsultation.messagePlaceholder': {
    fr: 'Bonjour, comment puis-je vous aider aujourd\'hui?',
    ar: 'مرحبًا، كيف يمكنني مساعدتك اليوم؟'
  },
  'teleconsultation.availableDoctors': {
    fr: 'Médecins disponibles',
    ar: 'الأطباء المتاحون'
  },
  'teleconsultation.select': {
    fr: 'Sélectionner',
    ar: 'اختيار'
  },
  'teleconsultation.requirements': {
    fr: 'Prérequis techniques',
    ar: 'المتطلبات التقنية'
  },
  'teleconsultation.requirementCamera': {
    fr: 'Caméra fonctionnelle',
    ar: 'كاميرا تعمل بشكل جيد'
  },
  'teleconsultation.requirementMicrophone': {
    fr: 'Microphone fonctionnel',
    ar: 'ميكروفون يعمل بشكل جيد'
  },
  'teleconsultation.requirementInternet': {
    fr: 'Connexion Internet stable',
    ar: 'اتصال إنترنت مستقر'
  },
  'teleconsultation.startVideoConsultation': {
    fr: 'Démarrer la consultation vidéo',
    ar: 'بدء الاستشارة بالفيديو'
  },
  'teleconsultation.startAudioConsultation': {
    fr: 'Démarrer la consultation audio',
    ar: 'بدء الاستشارة الصوتية'
  },
  'teleconsultation.startMessageConsultation': {
    fr: 'Démarrer la consultation par message',
    ar: 'بدء الاستشارة عبر الرسائل'
  },
  'teleconsultation.typeMessage': {
    fr: 'Tapez votre message...',
    ar: 'اكتب رسالتك...'
  },
  'teleconsultation.send': {
    fr: 'Envoyer',
    ar: 'إرسال'
  },
  'teleconsultation.benefits': {
    fr: 'Avantages',
    ar: 'المزايا'
  },
  'teleconsultation.benefitConvenient': {
    fr: 'Pratique et accessible à tout moment',
    ar: 'مريح ومتاح في أي وقت'
  },
  'teleconsultation.benefitDiscreet': {
    fr: 'Discret et confidentiel',
    ar: 'سري وخصوصي'
  },
  'teleconsultation.benefitFlexible': {
    fr: 'Flexible selon votre emploi du temps',
    ar: 'مرن حسب جدولك الزمني'
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
  },
  'general.viewMore': {
    fr: 'Voir plus',
    ar: 'عرض المزيد'
  },
  'general.address': {
    fr: 'Adresse',
    ar: 'العنوان'
  },
  'general.notes': {
    fr: 'Notes / Symptômes',
    ar: 'ملاحظات / أعراض'
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
