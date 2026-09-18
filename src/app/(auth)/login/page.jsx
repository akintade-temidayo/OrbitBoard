'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import EmailInput from '@/components/ui/EmailInput';
import PasswordInput from '@/components/ui/PasswordInput';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';

export default function LoginPage() {
const router = useRouter();
const { login } = useAuth();

const [formData, setFormData] = useState({
    email: '',
    password: '',
});

const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);

const handleChange = (field, eventOrValue) => {
    const val =
    typeof eventOrValue === 'string'
        ? eventOrValue
        : eventOrValue?.target?.value ?? '';

    setFormData((prev) => ({ ...prev, [field]: val }));

    if (errors[field]) {
    setErrors((prev) => ({ ...prev, [field]: '' }));
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email.trim()) {
    newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
    newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
    }

    setLoading(true);

    try {
    // 1. Authenticate with mock auth service
    const res = await authService.login(formData);

    // 2. Save session to AuthContext (updates state + localStorage)
    login(res.user, res.token);

    // 3. Redirect to the main home feed page (src/app/(main)/page.jsx)
    router.push('/');
    } catch (err) {
    setErrors({
        general: err?.message || 'Invalid email or password',
    });
    } finally {
    setLoading(false);
    }
};

return (
    <div className="flex flex-col w-full max-w-md mx-auto">
    {/* Header */}
    <div className="text-center flex flex-col gap-1.5 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[--text-primary] tracking-tight">
        Welcome back
        </h1>
        <p className="text-xs sm:text-sm text-[--text-secondary]">
        Log in to access your Orbits and account.
        </p>
    </div>

    {/* Form */}
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
        {errors.general && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 text-center font-medium">
            {errors.general}
        </div>
        )}

        {/* Email Field */}
        <EmailInput
        label="Email Address"
        value={formData.email}
        onChange={(e) => handleChange('email', e)}
        placeholder="john@example.com"
        error={errors.email}
        autoFocus
        />

        {/* Password Field */}
        <div className="flex flex-col gap-1">
        <PasswordInput
            label="Password"
            value={formData.password}
            onChange={(e) => handleChange('password', e)}
            placeholder="••••••••"
            error={errors.password}
            hideRequirements
        />

        <div className="flex justify-end mt-1">
            <Link
            href="/forgot-password"
            className="text-xs font-semibold text-[--accent-warm] hover:underline"
            >
            Forgot password?
            </Link>
        </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col items-center gap-4 mt-2">
        <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full justify-center py-3.5 rounded-2xl font-semibold shadow-lg shadow-sky-500/10"
        >
            {loading ? (
            'Logging in...'
            ) : (
            <>
                Log In <ArrowRight className="w-4 h-4 ml-1.5" />
            </>
            )}
        </Button>

        {/* Registration Redirect */}
        <p className="text-xs text-[--text-secondary]">
            Don&apos;t have an account?{' '}
            <Link
            href="/register/enter-fullname"
            className="font-semibold text-[--accent-warm] hover:underline"
            >
            Sign up
            </Link>
        </p>
        </div>
    </form>
    </div>
);
}
