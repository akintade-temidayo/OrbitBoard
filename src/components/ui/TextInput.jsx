'use client';

import FloatingLabelInput from './FloatingLabelInput';

export default function TextInput({ value = '', onChange, label = 'Full Name', error, ...props }) {
const handleChange = (e) => {
    let input = e.target.value;
    // Restrict strictly to letters, spaces, and hyphens
    input = input.replace(/[^a-zA-Z\s-]/g, '');

    if (onChange) {
    // Create a modified synthetic event clone so e.target.value works everywhere
    const syntheticEvent = {
        ...e,
        target: {
        ...e.target,
        value: input,
        },
    };
    onChange(syntheticEvent);
    }
};

// Live validation feedback
let localError = error;
if (value.length > 0 && value.length < 4) {
    localError = 'Must be at least 4 characters';
}

return (
    <FloatingLabelInput
    {...props}
    label={label}
    value={value}
    onChange={handleChange}
    maxLength={20}
    error={localError}
    />
);
}