import type { PrayerTimes, CalculationMethod } from '../types/prayer';

const API_URL = 'https://api.aladhan.com/v1/timings';
const SCHOOL = 0; // Shafi (standard) - gives earlier Asr time matching Umm al-Qura

export interface HijriDate {
    day: string;
    month: { en: string; ar: string };
    year: string;
    weekday: { en: string; ar: string };
}

export async function fetchPrayerTimes(
    latitude: number,
    longitude: number,
    calculationMethod: CalculationMethod,
    date?: Date
): Promise<PrayerTimes & { hijriDate?: HijriDate }> {
    const targetDate = date || new Date();
    const dateStr = `${targetDate.getDate()}-${targetDate.getMonth() + 1}-${targetDate.getFullYear()}`;

    const url = `${API_URL}/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=${calculationMethod}&school=${SCHOOL}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`API failed with status: ${response.status}`);

        const data = await response.json();
        if (data.code !== 200) throw new Error('API returned error');

        const timings = data.data.timings;
        const hijri = data.data.date?.hijri;

        return {
            Fajr: timings.Fajr.split(' ')[0],
            Sunrise: timings.Sunrise.split(' ')[0],
            Dhuhr: timings.Dhuhr.split(' ')[0],
            Asr: timings.Asr.split(' ')[0],
            Maghrib: timings.Maghrib.split(' ')[0],
            Isha: timings.Isha.split(' ')[0],
            hijriDate: hijri ? {
                day: hijri.day,
                month: { en: hijri.month.en, ar: hijri.month.ar },
                year: hijri.year,
                weekday: { en: hijri.weekday.en, ar: hijri.weekday.ar }
            } : undefined
        };
    } catch (error) {
        console.error('Error fetching prayer times:', error);
        throw error;
    }
}


export function cachePrayerTimes(location: string, times: PrayerTimes, date: string, method: CalculationMethod) {
    const cacheKey = `prayer-times-${location}-${date}-${method}`;
    localStorage.setItem(cacheKey, JSON.stringify(times));
}

export function getCachedPrayerTimes(location: string, date: string, method: CalculationMethod): PrayerTimes | null {
    const cacheKey = `prayer-times-${location}-${date}-${method}`;
    const cached = localStorage.getItem(cacheKey);
    return cached ? JSON.parse(cached) : null;
}

