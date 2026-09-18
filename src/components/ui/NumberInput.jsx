'use client';

import FloatingLabelInput from './FloatingLabelInput';

export default function NumberInput({
value = '',
onChange,
onPaste,
label = 'Verification Code',
maxLength = 6,
error,
...props
}) {
const handleChange = (e) => {
    const rawVal = typeof e === 'string' ? e : e?.target?.value ?? '';
    let input = rawVal.replace(/\D/g, ''); // Digits only
    if (maxLength) input = input.slice(0, maxLength);

    if (onChange) {
    onChange(input);
    }
};

const handlePaste = (e) => {
    if (onPaste) {
    onPaste(e);
    }
};

return (
    <FloatingLabelInput
    {...props}
    type="text"
    inputMode="numeric"
    autoComplete="one-time-code"
    label={label}
    value={value}
    onChange={handleChange}
    onPaste={handlePaste}
    maxLength={maxLength}
    error={error}
    />
);
}