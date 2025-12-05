import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallBanner, setShowInstallBanner] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const { language } = useLanguage();

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Listen for the beforeinstallprompt event
        const handler = (e: Event) => {
            e.preventDefault();
            const promptEvent = e as BeforeInstallPromptEvent;
            setDeferredPrompt(promptEvent);
            setShowInstallBanner(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if app was installed
        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setShowInstallBanner(false);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            return;
        }

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setShowInstallBanner(false);
        }

        // Clear the deferredPrompt
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowInstallBanner(false);
    };

    // Don't show if already installed or no prompt available
    if (isInstalled || !showInstallBanner) {
        return null;
    }

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
            <div className="bg-primary text-white rounded-lg shadow-2xl p-4 flex items-center justify-between gap-3 animate-slide-down">
                <div className="flex items-center gap-3 flex-1">
                    <Download className="w-6 h-6 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="font-bold text-sm">
                            {language === 'ar' ? 'حمّل التطبيق' : 'Install App'}
                        </p>
                        <p className="text-xs opacity-90">
                            {language === 'ar'
                                ? 'للوصول السريع والاستخدام دون اتصال'
                                : 'Quick access and offline use'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <button
                        onClick={handleInstallClick}
                        className="bg-white text-primary px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors whitespace-nowrap"
                    >
                        {language === 'ar' ? 'تثبيت' : 'Install'}
                    </button>
                    <button
                        onClick={handleDismiss}
                        className="p-2 rounded-full hover:bg-white/20 transition-colors"
                        aria-label={language === 'ar' ? 'إغلاق' : 'Close'}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
