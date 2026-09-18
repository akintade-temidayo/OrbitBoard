'use client';

import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

const THEMES = {
ocean: {
    id: 'ocean',
    name: 'Ocean Light',
    vars: {
    '--bg-main': '#f0f9ff',
    '--bg-surface': '#ffffff',
    '--bg-surface-hover': '#e0f2fe',
    '--border-subtle': '#bae6fd',
    '--text-primary': '#0c4a6e',
    '--text-secondary': '#0284c7',
    '--accent-warm': '#0284c7',
    },
},
'blue-dark': {
    id: 'blue-dark',
    name: 'Ocean Dark',
    vars: {
    '--bg-main': '#0f172a',
    '--bg-surface': '#1e293b',
    '--bg-surface-hover': '#334155',
    '--border-subtle': '#334155',
    '--text-primary': '#f8fafc',
    '--text-secondary': '#94a3b8',
    '--accent-warm': '#38bdf8',
    },
},
};

// Determine the initial theme BEFORE first render, so we never need to
// correct it with a setState call inside an effect.
function getInitialTheme() {
if (typeof window === 'undefined') {
    // SSR: no access to localStorage/matchMedia, fall back to default
    return 'ocean';
}

const savedTheme = localStorage.getItem('orbitboard-theme');
if (savedTheme && THEMES[savedTheme]) {
    return savedTheme;
}

if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'blue-dark';
}

return 'ocean';
}

export function ThemeProvider({ children }) {
const [theme, setTheme] = useState(getInitialTheme);

useEffect(() => {
    // Inject CSS variables into document root
    const root = document.documentElement;
    const selectedThemeVars = THEMES[theme]?.vars || THEMES['ocean'].vars;

    Object.entries(selectedThemeVars).forEach(([property, value]) => {
    root.style.setProperty(property, value);
    });

    // Toggle dark class for standard tailwind dark variant support if needed
    if (theme === 'blue-dark') {
    root.classList.add('dark');
    } else {
    root.classList.remove('dark');
    }

    localStorage.setItem('orbitboard-theme', theme);
}, [theme]);

const toggleTheme = () => {
    setTheme((prev) => (prev === 'ocean' ? 'blue-dark' : 'ocean'));
};

return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, themes: THEMES }}>
    {children}
    </ThemeContext.Provider>
);
}