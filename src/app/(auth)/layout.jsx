//auth layout
'use client';

import Link from 'next/link';

export default function AuthLayout({ children }) {
return (
    <div className="min-h-screen w-full bg-[--bg-main] text-[--text-primary] flex flex-col justify-between items-center p-4 sm:p-6 md:p-8">
    {/* Top Header Logo */}
    <header className="w-full max-w-2xl flex justify-center py-4">
        <Link href="/" className="flex items-center gap-2 group">
        <div className="w-9 h-9 rounded-xl bg-[--accent-warm] flex items-center justify-center font-black text-white text-xl shadow-md transition-transform group-hover:scale-105">
            O
        </div>
        <span className="font-extrabold text-2xl text-[--text-primary] tracking-tight">
            Orbit
        </span>
        </Link>
    </header>

    {/* Main Registration Form Container (Borderless & Frameless) */}
    <main className="w-full max-w-xl p-4 sm:p-6 my-auto">
        {children}
    </main>

    {/* Page Footer */}
    <footer className="w-full max-w-4xl flex items-center justify-between text-xs text-[--text-secondary] py-4 px-2">
        <span>© {new Date().getFullYear()} Orbit. All rights reserved.</span>
        <div className="flex gap-4">
        <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
        <Link href="/terms" className="hover:underline">Terms & Conditions</Link>
        </div>
    </footer>
    </div>
);
}