import React from 'react';
import ReactDOM from 'react-dom/client';
import { LanguageProvider } from './contexts/LanguageContext';
import { SettingsProvider } from './contexts/SettingsContext';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <LanguageProvider>
            <SettingsProvider>
                <App />
            </SettingsProvider>
        </LanguageProvider>
    </React.StrictMode>,
);

