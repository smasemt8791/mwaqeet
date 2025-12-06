import { formatTime12 } from '../utils/time';
import { useLanguage } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext';
import { toHindiNumerals, convertAmPmToArabic } from '../i18n/translations';
import type { PrayerTimesWithIqama, PrayerName } from '../types/prayer';

interface PrayerTimesCardProps {
    prayerTimes: PrayerTimesWithIqama;
}

const PRAYERS: Array<{ name: PrayerName; labelKey: string }> = [
    { name: 'Fajr', labelKey: 'fajr' },
    { name: 'Dhuhr', labelKey: 'dhuhr' },
    { name: 'Asr', labelKey: 'asr' },
    { name: 'Maghrib', labelKey: 'maghrib' },
    { name: 'Isha', labelKey: 'isha' },
];

export function PrayerTimesCard({ prayerTimes }: PrayerTimesCardProps) {
    const { language, t } = useLanguage();
    const { dateFormat } = useSettings();
    const now = new Date();

    // Gregorian date - explicitly set calendar to 'gregory' for Arabic to prevent Chrome/Edge from defaulting to Hijri
    const currentDate = now.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        calendar: 'gregory'  // Force Gregorian calendar in all browsers
    });

    // Hijri date
    const hijriDate = prayerTimes.hijriDate;
    const hijriDateString = hijriDate
        ? language === 'ar'
            ? `${hijriDate.weekday.ar}، ${toHindiNumerals(hijriDate.day)} ${hijriDate.month.ar} ${toHindiNumerals(hijriDate.year)} للهجرة`
            : `${hijriDate.weekday.en}, ${hijriDate.day} ${hijriDate.month.en} ${hijriDate.year} AH`
        : null;

    const gregorianSuffix = language === 'ar' ? ' ميلادي' : ' AD';

    // Display only the selected date format
    const displayDate = dateFormat === 'hijri'
        ? (hijriDateString || `${currentDate}${gregorianSuffix}`)
        : `${currentDate}${gregorianSuffix}`;

    let currentTime = now.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    // Convert AM/PM to ص/م in Arabic
    if (language === 'ar') {
        currentTime = convertAmPmToArabic(currentTime);
    }

    const formatTimeForDisplay = (timeString: string) => {
        let time = formatTime12(new Date(`2000-01-01 ${timeString}`));
        if (language === 'ar') {
            time = toHindiNumerals(time);
            time = convertAmPmToArabic(time);
        }
        return time;
    };

    return (
        <div className="flashcard">
            {/* Header: Date and Time */}
            <div className="text-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100 mb-2">
                    {displayDate}
                </h3>
                <p className="text-xl md:text-2xl font-bold text-primary">
                    {currentTime}
                </p>
            </div>

            {/* Prayer Times List */}
            <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4 text-center">
                    {t.todaysPrayerTimes}
                </h4>

                {PRAYERS.map((prayer) => {
                    const athanTime = prayerTimes[prayer.name];
                    const iqamaTime = prayerTimes[`${prayer.name}Iqama` as keyof PrayerTimesWithIqama] as string;

                    return (
                        <div
                            key={prayer.name}
                            className="grid grid-cols-3 gap-4 items-center py-3 px-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <div className="font-bold text-lg text-gray-900 dark:text-gray-100">
                                {t[prayer.labelKey as keyof typeof t]}
                            </div>

                            <div className="text-center">
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t.athan}</div>
                                <div className="text-base font-bold text-primary">
                                    {formatTimeForDisplay(athanTime)}
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t.iqama}</div>
                                <div className="text-base font-bold text-danger">
                                    {formatTimeForDisplay(iqamaTime)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
