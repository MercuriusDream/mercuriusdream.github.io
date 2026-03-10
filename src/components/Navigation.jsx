import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

export default function Navigation({ activeIndex = 0, onNavigate }) {
  const { currentLanguage, setLanguage } = useContext(LanguageContext);

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'ko', label: 'KO' },
    { code: 'jp', label: 'JP' }
  ];

  return (
    <div className="lang-selector">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`lang-btn ${currentLanguage === lang.code ? 'active' : ''}`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
