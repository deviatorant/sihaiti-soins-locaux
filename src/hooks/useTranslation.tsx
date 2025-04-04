
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translationData } from './useTranslationData';
import { supabase } from '@/services/supabase';

// Types
export type LanguageCode = 'en' | 'fr' | 'ar';

type TranslationContextType = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  isRTL: boolean;
};

// Create context
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Provider component
export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with browser language or default to French
  const [language, setLanguage] = useState<LanguageCode>(() => {
    const savedLang = localStorage.getItem('sihati_language');
    if (savedLang && ['en', 'fr', 'ar'].includes(savedLang)) {
      return savedLang as LanguageCode;
    }
    
    const browserLang = navigator.language.split('-')[0];
    // Default to French, unless explicitly set to English or Arabic
    return (browserLang === 'en' || browserLang === 'ar') ? browserLang as LanguageCode : 'fr';
  });
  
  // Save language preference to both localStorage and Supabase if user is authenticated
  useEffect(() => {
    console.log('Language set to:', language);
    localStorage.setItem('sihati_language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    
    // Update user preferences in Supabase if user is authenticated
    const updateUserLanguagePreference = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('user_preferences').upsert(
          { user_id: user.id, language_preference: language },
          { onConflict: 'user_id' }
        );
      }
    };
    
    updateUserLanguagePreference().catch(console.error);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translationData[language];
    
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key.split('.').pop() || key;
      }
    }
    
    return value;
  };

  return (
    <TranslationContext.Provider 
      value={{ 
        language, 
        setLanguage, 
        t, 
        isRTL: language === 'ar' 
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

// Hook to use the translation context
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
