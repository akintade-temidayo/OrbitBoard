'use client';

import { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import FloatingLabelInput from './FloatingLabelInput';

export default function PasswordInput({
value = '',
onChange,
label = 'Password',
error,
hideRequirements = false, // Add this prop
...props
}) {
const [showPassword, setShowPassword] = useState(false);
const [isFocused, setIsFocused] = useState(false);

const rules = [
    { label: '6 - 15 characters', valid: value.length >= 6 && value.length <= 15 },
    { label: 'One uppercase letter (A-Z)', valid: /[A-Z]/.test(value) },
    { label: 'One lowercase letter (a-z)', valid: /[a-z]/.test(value) },
    { label: 'One number (0-9)', valid: /[0-9]/.test(value) },
    { label: 'One special symbol (!@#$%^&*)', valid: /[^A-Za-z0-9]/.test(value) },
];

const handleChange = (e) => {
    const rawVal = typeof e === 'string' ? e : e?.target?.value ?? '';
    if (onChange) {
    onChange(rawVal.slice(0, 15));
    }
};

return (
    <div
    className="w-full flex flex-col gap-2"
    onFocus={() => setIsFocused(true)}
    onBlur={() => setIsFocused(false)}
    >
    <FloatingLabelInput
        {...props}
        type={showPassword ? 'text' : 'password'}
        label={label}
        value={value}
        onChange={handleChange}
        maxLength={15}
        error={error}
        rightElement={
        <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-[--text-secondary] hover:text-[--text-primary] transition-colors p-1"
        >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
        }
    />

    {/* Render checklist only if hideRequirements is false */}
    {!hideRequirements && (isFocused || value.length > 0) && (
        <div className="p-3 rounded-xl border border-[--border-subtle] bg-[--bg-main] flex flex-col gap-1.5 text-xs">
        <span className="font-semibold text-[--text-primary] mb-1">
            Password Requirements:
        </span>
        {rules.map((rule, idx) => (
            <div key={idx} className="flex items-center gap-2">
            {rule.valid ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
                <X className="w-3.5 h-3.5 text-red-400" />
            )}
            <span
                className={
                rule.valid
                    ? 'text-emerald-500 font-medium'
                    : 'text-[--text-secondary]'
                }
            >
                {rule.label}
            </span>
            </div>
        ))}
        </div>
    )}
    </div>
);
}