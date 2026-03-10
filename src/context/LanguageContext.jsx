import { createContext, useState, useCallback } from 'react';
import { translations } from '../data/translations';

export const LanguageContext = createContext({
  currentLanguage: 'en',
  setLanguage: () => {},
  t: translations.en
});

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const setLanguage = useCallback((lang) => {
    if (translations[lang]) {
      setCurrentLanguage(lang);
    }
  }, []);

  const value = {
    currentLanguage,
    setLanguage,
    t: translations[currentLanguage]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
