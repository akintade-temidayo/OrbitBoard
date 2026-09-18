'use client';

import FloatingLabelInput from './FloatingLabelInput';

export default function EmailInput({ value = '', onChange, label = 'Email Address', error, ...props }) {
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const handleChange = (e) => {
    // Pass the standard event along to parent components
    if (onChange) {
    onChange(e);
    }
};

let localError = error;
if (value.length > 0 && !emailRegex.test(value)) {
    localError = 'Please enter a valid email address';
}

return (
    <FloatingLabelInput
    {...props}
    type="email"
    label={label}
    value={value}
    onChange={handleChange}
    maxLength={60}
    error={localError}
    />
);
}