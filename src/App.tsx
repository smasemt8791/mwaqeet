import { useGeolocation } from './hooks/useGeolocation';
import { usePrayerTimes } from './hooks/usePrayerTimes';
import { CountdownCard } from './components/CountdownCard';
import { PrayerTimesCard } from './components/PrayerTimesCard';
import { SettingsModal } from './components/SettingsModal';
import { InstallButton } from './components/InstallButton';
import { useLanguage } from './contexts/LanguageContext';
import { useSettings } from './contexts/SettingsContext';
import { CALCULATION_METHODS } from './types/prayer';
import { Moon, Sun, MapPin, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import './index.css';

function App() {
    const [darkMode, setDarkMode] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { location, error: locationError, loading: locationLoading } = useGeolocation();
    const { prayerTimes, loading: timesLoading, error: timesError } = usePrayerTimes(location);
    const { t } = useLanguage();
    const { calculationMethod } = useSettings();

    // Apply dark mode class
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const loading = locationLoading || timesLoading;
    const error = locationError || timesError;

    const getMethodName = () => {
        const method = CALCULATION_METHODS.find(m => m.code === calculationMethod);
        return method ? t[method.nameKey as keyof typeof t] : '';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 transition-colors">
            {/* Install Button */}
            <InstallButton />

            {/* Header */}
            <header className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
                    {t.appTitle}
                    <span className="block text-lg md:text-xl font-normal text-gray-600 dark:text-gray-400 mt-1">
                        {t.appSubtitle}
                    </span>
                </h1>

                <div className="flex gap-2">
                    {/* Settings Button */}
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
                        aria-label={t.settings}
                        title={t.settings}
                    >
                        <Settings className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    </button>

                    {/* Theme Toggle */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
                        aria-label={t.toggleTheme}
                    >
                        {darkMode ? (
                            <Sun className="w-6 h-6 text-yellow-500" />
                        ) : (
                            <Moon className="w-6 h-6 text-gray-700" />
                        )}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto">
                {loading && (
                    <div className="flex items-center justify-center min-h-[500px]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
                            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                                {t.loadingPrayerTimes}
                            </p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg mb-8">
                        <p className="font-semibold">{t.error}: {error}</p>
                    </div>
                )}

                {!loading && prayerTimes && (
                    <>
                        {/* Location Info */}
                        {location && (
                            <div className="mb-6 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                                <MapPin className="w-5 h-5" />
                                <span className="text-sm font-medium">
                                    {location.city || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
                                </span>
                            </div>
                        )}

                        {/* Flashcards Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Countdown Card - Takes 2 columns on large screens */}
                            <div className="lg:col-span-2">
                                <CountdownCard prayerTimes={prayerTimes} />
                            </div>

                            {/* Prayer Times Info Card - Takes 1 column */}
                            <div className="lg:col-span-1">
                                <PrayerTimesCard prayerTimes={prayerTimes} />
                            </div>
                        </div>
                    </>
                )}
            </main>

            {/* Footer */}
            <footer className="max-w-7xl mx-auto mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
                <p>{t.calculatedUsing} {getMethodName()}</p>
            </footer>

            {/* Settings Modal */}
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
    );
}

export default App;

