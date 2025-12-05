import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    // ✅ 1. Correct: Sets the base URL for built assets (JS/CSS)
    base: '/mwaqeet/', // GitHub Pages base path
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
            manifest: {
                name: 'Mawaqeet Navigator',
                short_name: 'Mawaqeet',
                description: 'Global Prayer Times & Qibla Compass',
                theme_color: '#10b981',
                background_color: '#ffffff',
                display: 'standalone',
                orientation: 'portrait',
                
                // 🛑 CRITICAL FIXES FOR GITHUB PAGES:
                // Set the scope and start_url to the subdirectory
                scope: '/mwaqeet/', 
                start_url: '/mwaqeet/', 
                // ----------------------------------------

                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            },
            workbox: {
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/api\.aladhan\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'prayer-times-cache',
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    }
                ]
            }
        })
    ],
})