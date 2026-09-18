const canUseStorage = () => typeof window !== 'undefined';

export function readStoredValue(key, fallback) {
    if (!canUseStorage()) return fallback;

    try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
    } catch (error) {
        console.warn(`Unable to read ${key} from local storage.`, error);
        return fallback;
    }
}

export function writeStoredValue(key, value) {
    if (!canUseStorage()) return;

    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        // Base64 images consume storage quickly, so provide a useful failure instead
        // of silently losing a user's change.
        if (error?.name === 'QuotaExceededError') {
            throw new Error('Browser storage is full. Try a smaller image or clear unused local data.');
        }
        throw error;
    }
}

export function removeStoredValue(key) {
    if (canUseStorage()) localStorage.removeItem(key);
}

