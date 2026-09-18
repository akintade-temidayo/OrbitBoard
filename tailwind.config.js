/** @type {import('tailwindcss').Config} */
module.exports = {
darkMode: 'class', // Enables class-based dark mode toggling (.dark class on <html> or <body>)
content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
],
theme: {
    extend: {
    colors: {
        main: 'var(--bg-main)',
        surface: {
        DEFAULT: 'var(--bg-surface)',
        hover: 'var(--bg-surface-hover)',
        },
        'border-subtle': 'var(--border-subtle)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        accent: 'var(--accent-warm)',
    },
    },
},
plugins: [],
};