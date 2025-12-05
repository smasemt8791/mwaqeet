import { useState, useEffect } from 'react';
import type { Location } from '../types/prayer';

// Reverse geocoding using OpenStreetMap Nominatim API
async function reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            {
                headers: {
                    'Accept-Language': 'en',
                    'User-Agent': 'MawaqeetPWA/1.0'
                }
            }
        );

        if (!response.ok) {
            console.error('Nominatim API error:', response.status);
            return null;
        }

        const data = await response.json();

        // Try to get the most specific location name available
        const address = data.address;
        const locationName = address?.city ||
            address?.town ||
            address?.village ||
            address?.suburb ||
            address?.county ||
            address?.state ||
            address?.country ||
            null;

        console.log('Reverse geocoding result:', locationName);
        return locationName;
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        return null;
    }
}

export function useGeolocation() {
    const [location, setLocation] = useState<Location | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by this browser.');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                // Get location name via reverse geocoding
                const cityName = await reverseGeocode(latitude, longitude);

                setLocation({
                    latitude,
                    longitude,
                    city: cityName || undefined
                });
                setLoading(false);
            },
            (err) => {
                console.error('Geolocation error:', err);
                // Fallback to Mecca
                setLocation({
                    latitude: 21.4225,
                    longitude: 39.8262,
                    city: 'Mecca (Default)'
                });
                setError('Using default location (Mecca)');
                setLoading(false);
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 600000
            }
        );
    }, []);

    return { location, error, loading };
}
