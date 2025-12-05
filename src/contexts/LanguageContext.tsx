import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, Translations } from '../i18n/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
    isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'mawaqeet-language';

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => {
        // Load from localStorage or default to English
        const saved = localStorage.getItem(STORAGE_KEY);
        return (saved === 'ar' || saved === 'en') ? saved : 'en';
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem(STORAGE_KEY, lang);

        // Update document direction and lang attribute
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', lang);
    };

    // Set initial direction
    useEffect(() => {
        document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', language);
    }, []);

    const value: LanguageContextType = {
        language,
        setLanguage,
        t: translations[language],
        isRTL: language === 'ar',
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
}
