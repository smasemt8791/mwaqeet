import { useLanguage } from '../contexts/LanguageContext';
import { useSettings, DateFormat } from '../contexts/SettingsContext';
import { CALCULATION_METHODS } from '../types/prayer';
import { X, Check } from 'lucide-react';
import type { CalculationMethod } from '../types/prayer';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { t, language, setLanguage } = useLanguage();
    const { calculationMethod, setCalculationMethod, dateFormat, setDateFormat } = useSettings();

    if (!isOpen) return null;

    const handleMethodSelect = (method: CalculationMethod) => {
        setCalculationMethod(method);
    };

    const handleDateFormatSelect = (format: DateFormat) => {
        setDateFormat(format);
    };

    const handleLanguageSelect = (lang: 'en' | 'ar') => {
        setLanguage(lang);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {t.settings}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label={t.close}
                    >
                        <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Settings Content */}
                <div className="overflow-y-auto max-h-[60vh] p-4">
                    {/* Language Selection Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">
                            {t.language}
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleLanguageSelect('en')}
                                className={`
                                    p-4 rounded-lg text-center transition-all font-semibold
                                    ${language === 'en'
                                        ? 'bg-primary/10 border-2 border-primary dark:bg-primary/20 text-primary'
                                        : 'bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-gray-100'
                                    }
                                `}
                            >
                                <div className="flex items-center justify-between">
                                    <span>English</span>
                                    {language === 'en' && <Check className="w-5 h-5" />}
                                </div>
                            </button>

                            <button
                                onClick={() => handleLanguageSelect('ar')}
                                className={`
                                    p-4 rounded-lg text-center transition-all font-semibold
                                    ${language === 'ar'
                                        ? 'bg-primary/10 border-2 border-primary dark:bg-primary/20 text-primary'
                                        : 'bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-gray-100'
                                    }
                                `}
                            >
                                <div className="flex items-center justify-between">
                                    <span>العربية</span>
                                    {language === 'ar' && <Check className="w-5 h-5" />}
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Date Format Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">
                            {t.dateFormat}
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleDateFormatSelect('hijri')}
                                className={`
                                    p-4 rounded-lg text-center transition-all font-semibold
                                    ${dateFormat === 'hijri'
                                        ? 'bg-primary/10 border-2 border-primary dark:bg-primary/20 text-primary'
                                        : 'bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-gray-100'
                                    }
                                `}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{t.hijriCalendar}</span>
                                    {dateFormat === 'hijri' && <Check className="w-5 h-5" />}
                                </div>
                            </button>

                            <button
                                onClick={() => handleDateFormatSelect('gregorian')}
                                className={`
                                    p-4 rounded-lg text-center transition-all font-semibold
                                    ${dateFormat === 'gregorian'
                                        ? 'bg-primary/10 border-2 border-primary dark:bg-primary/20 text-primary'
                                        : 'bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-gray-100'
                                    }
                                `}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{t.gregorianCalendar}</span>
                                    {dateFormat === 'gregorian' && <Check className="w-5 h-5" />}
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Calculation Method Section */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">
                            {t.calculationMethod}
                        </h3>
                        <div className="space-y-2">
                            {CALCULATION_METHODS.map((method) => {
                                const isSelected = method.code === calculationMethod;
                                return (
                                    <button
                                        key={method.code}
                                        onClick={() => handleMethodSelect(method.code)}
                                        className={`
                                            w-full p-4 rounded-lg text-left transition-all
                                            ${isSelected
                                                ? 'bg-primary/10 border-2 border-primary dark:bg-primary/20'
                                                : 'bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className={`font-semibold ${isSelected ? 'text-primary' : 'text-gray-900 dark:text-gray-100'}`}>
                                                {t[method.nameKey as keyof typeof t]}
                                            </span>
                                            {isSelected && (
                                                <Check className="w-6 h-6 text-primary" />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
