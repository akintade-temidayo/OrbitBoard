'use client';

import Link from 'next/link';
import { ArrowRight, LogIn, UserPlus } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function OnboardingPage() {
  return (
    <div className="flex flex-col w-full max-w-md mx-auto">
      <div className="text-center flex flex-col gap-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[--text-primary] tracking-tight">
          Welcome to Orbit
        </h1>
        <p className="text-xs sm:text-sm text-[--text-secondary] leading-relaxed">
          Join thousands of people sharing thoughts, media, and building their digital footprint today.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <Link href="/register/enter-fullname" className="w-full">
          <Button
            variant="primary"
            className="w-full justify-center py-3.5 rounded-2xl font-semibold shadow-lg shadow-sky-500/10"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Create an Account
          </Button>
        </Link>

        <Link href="/login" className="w-full">
          <Button
            variant="secondary"
            className="w-full justify-center py-3.5 rounded-2xl font-semibold"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Log In
          </Button>
        </Link>
      </div>

      <div className="pt-6 mt-8 border-t border-[--border-subtle] text-center">
        <Link
          href="/"
          className="text-xs font-semibold text-[--text-secondary] hover:text-[--accent-warm] transition-colors inline-flex items-center gap-1 group"
        >
          Continue as Guest
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
