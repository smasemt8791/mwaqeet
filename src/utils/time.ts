import { IQAMA_OFFSETS, type PrayerName } from '../types/prayer';

export function parseTimeString(time24: string): Date {
    const [hours, minutes] = time24.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}

export function addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
}

export function calculateIqamaTime(athanTime: string, prayerName: PrayerName): string {
    const athanDate = parseTimeString(athanTime);
    const offset = IQAMA_OFFSETS[prayerName];
    const iqamaDate = addMinutes(athanDate, offset);

    const hours = String(iqamaDate.getHours()).padStart(2, '0');
    const minutes = String(iqamaDate.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
}

export function formatTime12(date: Date, locale: string = 'en-US'): string {
    return date.toLocaleTimeString(locale, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

export function formatTimeRemaining(ms: number): string {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
