import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'compact' | 'pill' | 'navbar';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  className = '',
  variant = 'pill'
}) => {
  const { language, setLanguage } = useLanguage();

  if (variant === 'compact') {
    return (
      <button
        onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border transition-all duration-200 ${
          language === 'bn' 
            ? 'bg-gold/15 text-gold-dark border-gold/40' 
            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
        } ${className}`}
        title="Switch Language / ভাষা পরিবর্তন"
      >
        <Globe className="w-3.5 h-3.5" />
        <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
      </button>
    );
  }

  return (
    <div className={`inline-flex items-center bg-slate-100/90 p-0.5 rounded-full border border-slate-200 text-xs font-medium ${className}`}>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-full transition-all duration-150 ${
          language === 'en'
            ? 'bg-royal text-white shadow-sm font-semibold'
            : 'text-slate-600 hover:text-navy-900'
        }`}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLanguage('bn')}
        className={`px-2.5 py-1 rounded-full transition-all duration-150 ${
          language === 'bn'
            ? 'bg-royal text-white shadow-sm font-semibold'
            : 'text-slate-600 hover:text-navy-900'
        }`}
      >
        বাংলা
      </button>
    </div>
  );
};
