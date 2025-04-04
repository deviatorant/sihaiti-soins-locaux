
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translationData } from './useTranslationData';
import { supabase } from '@/services/supabase';

// Types
export type LanguageCode = 'en' | 'fr' | 'ar';

type TranslationContextType = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, params?: Record<string, string>) => string;
  isRTL: boolean;
};

// Create context
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Provider component
export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always initialize with French by default
  const [language, setLanguage] = useState<LanguageCode>('fr');
  
  // Set language preference based on localStorage on mount, but still default to French
  useEffect(() => {
    const savedLang = localStorage.getItem('sihati_language');
    if (savedLang && ['en', 'fr', 'ar'].includes(savedLang)) {
      setLanguage(savedLang as LanguageCode);
    } else {
      // Default to French and save to localStorage
      localStorage.setItem('sihati_language', 'fr');
    }
    
    // Set document lang and dir attributes
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, []);
  
  // Save language preference to both localStorage and Supabase if user is authenticated
  useEffect(() => {
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

  // Translation function with improved fallback
  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = translationData[language];
    
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        // Return key last part as fallback instead of showing translation keys
        const lastKeyPart = key.split('.').pop() || key;
        return lastKeyPart;
      }
    }
    
    // Handle string interpolation if params are provided
    if (typeof value === 'string' && params) {
      return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
        return acc.replace(new RegExp(`{${paramKey}}`, 'g'), paramValue);
      }, value);
    }
    
    return typeof value === 'string' ? value : key.split('.').pop() || key;
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
