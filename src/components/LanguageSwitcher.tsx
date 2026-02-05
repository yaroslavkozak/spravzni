'use client'

import { useI18n } from '@/src/contexts/I18nContext';
import type { SupportedLanguage } from '@/src/lib/i18n';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();
  
  const languages: Array<{ code: SupportedLanguage; label: string }> = [
    { code: 'uk', label: 'UA' },
    { code: 'en', label: 'EN' }
  ];
  
  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];
  const otherLanguage = languages.find(lang => lang.code !== language) || languages[1];

  const handleClick = () => {
    setLanguage(otherLanguage.code);
  };

  return (
    <button
      className="flex items-center font-montserrat text-[#FBFBF9] text-[16px] font-normal leading-[1.5em] tracking-[-0.5%] transition-opacity duration-200 hover:opacity-80 cursor-pointer"
      onClick={handleClick}
      aria-label={`Switch to ${otherLanguage.code === 'uk' ? 'Ukrainian' : 'English'}`}
    >
      <span className="inline-block transition-opacity duration-200">
        {otherLanguage.label}
      </span>
    </button>
  );
}

