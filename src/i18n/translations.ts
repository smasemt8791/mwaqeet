export type Language = 'en' | 'ar';

export interface Translations {
    // App Header
    appTitle: string;
    appSubtitle: string;

    // Theme
    toggleTheme: string;
    toggleLanguage: string;

    // Loading & Errors
    loading: string;
    loadingPrayerTimes: string;
    error: string;

    // Location
    location: string;
    language: string;

    // Prayer Names
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;

    // Prayer Times Card
    todaysPrayerTimes: string;
    athan: string;
    iqama: string;

    // Countdown Card
    nextPrayer: string;
    untilIqama: string;
    athanAt: string;
    iqamaAt: string;

    // Settings
    settings: string;
    calculationMethod: string;
    selectMethod: string;
    dateFormat: string;
    hijriCalendar: string;
    gregorianCalendar: string;
    close: string;

    // Footer
    calculatedUsing: string;

    // Calculation Methods
    method_mwl: string;
    method_isna: string;
    method_egypt: string;
    method_makkah: string;
    method_karachi: string;
    method_tehran: string;
    method_jafari: string;
    method_uoif: string;
    method_turkey: string;
}

// Convert Western Arabic numerals to Hindi (Arabic-Indic) numerals
export function toHindiNumerals(str: string): string {
    const hindiNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return str.replace(/\d/g, (digit) => hindiNumerals[parseInt(digit)]);
}

// Convert AM/PM to Arabic abbreviations (ص/م)
export function convertAmPmToArabic(timeString: string): string {
    return timeString.replace(/AM/gi, 'ص').replace(/PM/gi, 'م');
}

export const translations: Record<Language, Translations> = {
    en: {
        // App Header
        appTitle: 'Mawaqeet',
        appSubtitle: 'Prayer Times Navigator',

        // Theme
        toggleTheme: 'Toggle theme',
        toggleLanguage: 'Switch to Arabic',

        // Loading & Errors
        loading: 'Loading...',
        loadingPrayerTimes: 'Loading prayer times...',
        error: 'Error',

        // Location
        location: 'Location',
        language: 'Language',

        // Prayer Names
        fajr: 'Fajr',
        sunrise: 'Sunrise',
        dhuhr: 'Dhuhr',
        asr: 'Asr',
        maghrib: 'Maghrib',
        isha: 'Isha',

        // Prayer Times Card
        todaysPrayerTimes: "Today's Prayer Times",
        athan: 'Athan',
        iqama: 'Iqama',

        // Countdown Card
        nextPrayer: 'Next Prayer',
        untilIqama: 'Until Iqama',
        athanAt: 'Athan at',
        iqamaAt: 'Iqama at',

        // Settings
        settings: 'Settings',
        calculationMethod: 'Calculation Method',
        selectMethod: 'Select Calculation Method',
        dateFormat: 'Date Format',
        hijriCalendar: 'Hijri Calendar',
        gregorianCalendar: 'Gregorian Calendar',
        close: 'Close',

        // Footer
        calculatedUsing: 'Calculated using',

        // Calculation Methods
        method_mwl: 'Muslim World League (MWL)',
        method_isna: 'Islamic Society of North America (ISNA)',
        method_egypt: 'Egyptian General Authority of Survey',
        method_makkah: 'Umm al-Qura University, Makkah',
        method_karachi: 'University of Islamic Sciences, Karachi',
        method_tehran: 'Institute of Geophysics, University of Tehran',
        method_jafari: 'Jafari (Shia Ithna Ashari)',
        method_uoif: 'Union of Islamic Organizations of France (UOIF)',
        method_turkey: 'Presidency of Religious Affairs, Türkiye',
    },
    ar: {
        // App Header
        appTitle: 'مواقيت',
        appSubtitle: 'دليل أوقات الصلاة',

        // Theme
        toggleTheme: 'تبديل المظهر',
        toggleLanguage: 'Switch to English',

        // Loading & Errors
        loading: 'جاري التحميل...',
        loadingPrayerTimes: 'جاري تحميل أوقات الصلاة...',
        error: 'خطأ',

        // Location
        location: 'الموقع',
        language: 'اللغة',

        // Prayer Names
        fajr: 'الفجر',
        sunrise: 'الشروق',
        dhuhr: 'الظهر',
        asr: 'العصر',
        maghrib: 'المغرب',
        isha: 'العشاء',

        // Prayer Times Card
        todaysPrayerTimes: 'أوقات الصلاة اليوم',
        athan: 'الأذان',
        iqama: 'الإقامة',

        // Countdown Card
        nextPrayer: 'الصلاة القادمة',
        untilIqama: 'حتى الإقامة',
        athanAt: 'الأذان في',
        iqamaAt: 'الإقامة في',

        // Settings
        settings: 'الإعدادات',
        calculationMethod: 'طريقة الحساب',
        selectMethod: 'اختر طريقة الحساب',
        dateFormat: 'نوع التقويم',
        hijriCalendar: 'التقويم الهجري',
        gregorianCalendar: 'التقويم الميلادي',
        close: 'إغلاق',

        // Footer
        calculatedUsing: 'الحساب:',

        // Calculation Methods
        method_mwl: 'رابطة العالم الإسلامي',
        method_isna: 'الجمعية الإسلامية لأمريكا الشمالية',
        method_egypt: 'الهيئة المصرية العامة للمساحة',
        method_makkah: 'جامعة أم القرى، مكة المكرمة',
        method_karachi: 'جامعة العلوم الإسلامية، كراتشي',
        method_tehran: 'معهد الجيوفيزياء، جامعة طهران',
        method_jafari: 'الجعفري (الشيعة الإثنا عشرية)',
        method_uoif: 'اتحاد المنظمات الإسلامية في فرنسا',
        method_turkey: 'رئاسة الشؤون الدينية، تركيا',
    }
};
