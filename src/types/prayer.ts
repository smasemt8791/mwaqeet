export interface HijriDate {
    day: string;
    month: { en: string; ar: string };
    year: string;
    weekday: { en: string; ar: string };
}

export interface PrayerTimes {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    hijriDate?: HijriDate;
}

export interface PrayerTimesWithIqama extends PrayerTimes {
    FajrIqama: string;
    DhuhrIqama: string;
    AsrIqama: string;
    MaghribIqama: string;
    IshaIqama: string;
}

export type PrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export interface CountdownState {
    prayerName: PrayerName;
    targetTime: Date;
    isIqamaCountdown: boolean; // true = counting to Iqama (red), false = counting to Athan (green)
}

export interface Location {
    latitude: number;
    longitude: number;
    city?: string;
}

// Calculation Methods (removed Jafari and Tehran)
export type CalculationMethod = 1 | 2 | 3 | 4 | 5 | 12 | 13;

export interface CalculationMethodInfo {
    code: CalculationMethod;
    nameKey: string; // Key for translation
}

export const CALCULATION_METHODS: CalculationMethodInfo[] = [
    { code: 3, nameKey: 'method_mwl' }, // Muslim World League
    { code: 2, nameKey: 'method_isna' }, // ISNA
    { code: 5, nameKey: 'method_egypt' }, // Egyptian
    { code: 4, nameKey: 'method_makkah' }, // Umm al-Qura (default)
    { code: 1, nameKey: 'method_karachi' }, // Karachi
    { code: 12, nameKey: 'method_uoif' }, // UOIF
    { code: 13, nameKey: 'method_turkey' }, // Turkey
];

// Default Iqama offsets in minutes
export const IQAMA_OFFSETS: Record<PrayerName, number> = {
    Fajr: 25,
    Dhuhr: 20,
    Asr: 20,
    Maghrib: 15,
    Isha: 20,
};
