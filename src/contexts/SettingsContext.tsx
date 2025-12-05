import { createContext, useContext, useState, ReactNode } from 'react';
import { CalculationMethod } from '../types/prayer';

export type DateFormat = 'hijri' | 'gregorian';

interface SettingsContextType {
    calculationMethod: CalculationMethod;
    setCalculationMethod: (method: CalculationMethod) => void;
    dateFormat: DateFormat;
    setDateFormat: (format: DateFormat) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const CALC_METHOD_STORAGE_KEY = 'mawaqeet-calculation-method';
const DATE_FORMAT_STORAGE_KEY = 'mawaqeet-date-format';
const DEFAULT_METHOD: CalculationMethod = 4; // Umm al-Qura
const DEFAULT_DATE_FORMAT: DateFormat = 'hijri';

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [calculationMethod, setCalculationMethodState] = useState<CalculationMethod>(() => {
        const saved = localStorage.getItem(CALC_METHOD_STORAGE_KEY);
        if (saved) {
            const parsed = parseInt(saved, 10);
            // Validate it's a valid method (removed Jafari and Tehran)
            if ([1, 2, 3, 4, 5, 12, 13].includes(parsed)) {
                return parsed as CalculationMethod;
            }
        }
        return DEFAULT_METHOD;
    });

    const [dateFormat, setDateFormatState] = useState<DateFormat>(() => {
        const saved = localStorage.getItem(DATE_FORMAT_STORAGE_KEY);
        return (saved === 'hijri' || saved === 'gregorian') ? saved : DEFAULT_DATE_FORMAT;
    });

    const setCalculationMethod = (method: CalculationMethod) => {
        setCalculationMethodState(method);
        localStorage.setItem(CALC_METHOD_STORAGE_KEY, method.toString());
    };

    const setDateFormat = (format: DateFormat) => {
        setDateFormatState(format);
        localStorage.setItem(DATE_FORMAT_STORAGE_KEY, format);
    };

    return (
        <SettingsContext.Provider value={{ calculationMethod, setCalculationMethod, dateFormat, setDateFormat }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within SettingsProvider');
    }
    return context;
}

