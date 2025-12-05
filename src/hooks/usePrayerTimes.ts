import { useState, useEffect } from 'react';
import { fetchPrayerTimes, cachePrayerTimes, getCachedPrayerTimes } from '../services/prayerApi';
import { calculateIqamaTime } from '../utils/time';
import { useSettings } from '../contexts/SettingsContext';
import type { PrayerTimesWithIqama, Location } from '../types/prayer';

export function usePrayerTimes(location: Location | null) {
    const { calculationMethod } = useSettings();
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimesWithIqama | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!location) return;

        const loadPrayerTimes = async () => {
            try {
                setLoading(true);
                const today = new Date();
                const dateStr = today.toISOString().split('T')[0];
                const locationKey = `${location.latitude.toFixed(2)},${location.longitude.toFixed(2)}`;

                // Try cache first
                let times = getCachedPrayerTimes(locationKey, dateStr, calculationMethod);

                // Fetch if not cached
                if (!times) {
                    times = await fetchPrayerTimes(location.latitude, location.longitude, calculationMethod);
                    cachePrayerTimes(locationKey, times, dateStr, calculationMethod);
                }

                // Calculate Iqama times
                const timesWithIqama: PrayerTimesWithIqama = {
                    ...times,
                    FajrIqama: calculateIqamaTime(times.Fajr, 'Fajr'),
                    DhuhrIqama: calculateIqamaTime(times.Dhuhr, 'Dhuhr'),
                    AsrIqama: calculateIqamaTime(times.Asr, 'Asr'),
                    MaghribIqama: calculateIqamaTime(times.Maghrib, 'Maghrib'),
                    IshaIqama: calculateIqamaTime(times.Isha, 'Isha'),
                };

                setPrayerTimes(timesWithIqama);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load prayer times');
            } finally {
                setLoading(false);
            }
        };

        loadPrayerTimes();
    }, [location, calculationMethod]);

    return { prayerTimes, loading, error };
}

