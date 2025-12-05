import { useState, useEffect } from 'react';
import { parseTimeString, formatTimeRemaining } from '../utils/time';
import { useLanguage } from '../contexts/LanguageContext';
import { toHindiNumerals, convertAmPmToArabic } from '../i18n/translations';
import type { PrayerTimesWithIqama, PrayerName, CountdownState } from '../types/prayer';

interface CountdownCardProps {
    prayerTimes: PrayerTimesWithIqama;
}

const PRAYER_ORDER: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const PRAYER_NAME_KEYS: Record<PrayerName, string> = {
    Fajr: 'fajr',
    Dhuhr: 'dhuhr',
    Asr: 'asr',
    Maghrib: 'maghrib',
    Isha: 'isha',
};

export function CountdownCard({ prayerTimes }: CountdownCardProps) {
    const { language, t } = useLanguage();
    const [countdown, setCountdown] = useState<CountdownState | null>(null);
    const [timeRemaining, setTimeRemaining] = useState<string>('00:00:00');

    // Find the next prayer or Iqama
    useEffect(() => {
        const findNextTarget = () => {
            const now = new Date();

            for (const prayerName of PRAYER_ORDER) {
                const athanTime = parseTimeString(prayerTimes[prayerName]);
                const iqamaTime = parseTimeString(prayerTimes[`${prayerName}Iqama` as keyof PrayerTimesWithIqama] as string);

                // Check if we're before Athan
                if (now < athanTime) {
                    return {
                        prayerName,
                        targetTime: athanTime,
                        isIqamaCountdown: false
                    };
                }

                // Check if we're between Athan and Iqama
                if (now >= athanTime && now < iqamaTime) {
                    return {
                        prayerName,
                        targetTime: iqamaTime,
                        isIqamaCountdown: true
                    };
                }
            }

            // If all prayers passed, next is Fajr tomorrow
            const tomorrowFajr = parseTimeString(prayerTimes.Fajr);
            tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);

            return {
                prayerName: 'Fajr' as PrayerName,
                targetTime: tomorrowFajr,
                isIqamaCountdown: false
            };
        };

        setCountdown(findNextTarget());
    }, [prayerTimes]);

    // Update countdown every second
    useEffect(() => {
        if (!countdown) return;

        const interval = setInterval(() => {
            const now = new Date();
            const diff = countdown.targetTime.getTime() - now.getTime();

            if (diff <= 0) {
                // Time reached, recalculate
                setCountdown(null);
                setTimeout(() => {
                    // Give a brief moment before recalculating
                    const findNextTarget = () => {
                        const now = new Date();

                        for (const prayerName of PRAYER_ORDER) {
                            const athanTime = parseTimeString(prayerTimes[prayerName]);
                            const iqamaTime = parseTimeString(prayerTimes[`${prayerName}Iqama` as keyof PrayerTimesWithIqama] as string);

                            if (now < athanTime) {
                                return { prayerName, targetTime: athanTime, isIqamaCountdown: false };
                            }
                            if (now >= athanTime && now < iqamaTime) {
                                return { prayerName, targetTime: iqamaTime, isIqamaCountdown: true };
                            }
                        }

                        const tomorrowFajr = parseTimeString(prayerTimes.Fajr);
                        tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
                        return { prayerName: 'Fajr' as PrayerName, targetTime: tomorrowFajr, isIqamaCountdown: false };
                    };

                    setCountdown(findNextTarget());
                }, 1000);
            } else {
                setTimeRemaining(formatTimeRemaining(diff));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [countdown, prayerTimes]);

    if (!countdown) {
        return (
            <div className="flashcard flashcard-countdown-green flex items-center justify-center min-h-[400px]">
                <div className="text-2xl font-bold text-gray-400">{t.loading}</div>
            </div>
        );
    }

    const cardClass = countdown.isIqamaCountdown
        ? 'flashcard flashcard-countdown-red'
        : 'flashcard flashcard-countdown-green';

    const titleColor = countdown.isIqamaCountdown ? 'text-danger' : 'text-primary';
    const timerColor = countdown.isIqamaCountdown ? 'text-danger' : 'text-primary';

    const getPrayerName = () => {
        const key = PRAYER_NAME_KEYS[countdown.prayerName];
        return t[key as keyof typeof t];
    };

    const displayCountdown = language === 'ar' ? toHindiNumerals(timeRemaining) : timeRemaining;

    let targetTimeString = countdown.targetTime.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    // Convert AM/PM to ص/م in Arabic
    if (language === 'ar') {
        targetTimeString = convertAmPmToArabic(targetTimeString);
    }

    return (
        <div className={`${cardClass} text-center min-h-[400px] flex flex-col justify-center`}>
            <p className={`text-lg md:text-xl font-bold uppercase mb-2 ${titleColor}`}>
                {countdown.isIqamaCountdown ? t.untilIqama : t.nextPrayer}
            </p>

            <h2 className="text-5xl md:text-6xl font-black mb-6 text-gray-900 dark:text-gray-100">
                {getPrayerName()}
            </h2>

            <div className={`text-6xl md:text-7xl lg:text-8xl font-black mb-6 ${timerColor} tracking-tight`}>
                {displayCountdown}
            </div>

            <p className="text-lg md:text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">
                {countdown.isIqamaCountdown ? t.iqamaAt : t.athanAt}
            </p>
            <p className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">
                {targetTimeString}
            </p>
        </div>
    );
}
