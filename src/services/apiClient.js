const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://orbitboard-backend.onrender.com').replace(/\/+$/, '');

function formatApiErrors(errors) {
if (!errors) return '';

if (Array.isArray(errors)) {
return errors
    .map((error) => {
    if (typeof error === 'string') return error;
    if (!error || typeof error !== 'object') return String(error);
    const field = error.field ? `${error.field}: ` : '';
    return `${field}${error.message || error.msg || JSON.stringify(error)}`;
    })
    .join(', ');
}

if (typeof errors === 'object') {
return Object.entries(errors)
    .map(([field, error]) => {
    const value = Array.isArray(error) ? error.join(', ') : error;
    return `${field}: ${typeof value === 'object' ? JSON.stringify(value) : value}`;
    })
    .join(', ');
}

return String(errors);
}

function getStoredToken() {
if (typeof window === 'undefined') return null;
return window.localStorage.getItem('orbitboard_token');
}

export async function apiRequest(path, options = {}) {
const { body, headers = {}, token = getStoredToken(), ...requestOptions } = options;
const requestHeaders = new Headers(headers);

if (body !== undefined && !(body instanceof FormData)) {
requestHeaders.set('Content-Type', 'application/json');
}

if (token) {
requestHeaders.set('Authorization', `Bearer ${token.replace(/^Bearer\s+/i, '')}`);
}

// Ensure path starts with a single forward slash to avoid broken URLs
const cleanPath = path.startsWith('/') ? path : `/${path}`;
const fullUrl = `${API_URL}${cleanPath}`;

try {
const response = await fetch(fullUrl, {
    credentials: 'include', // Needed for CORS requests with auth/cookies across domains
    ...requestOptions,
    headers: requestHeaders,
    body: body === undefined || body instanceof FormData ? body : JSON.stringify(body),
});

const contentType = response.headers.get('content-type') || '';
const payload = contentType.includes('application/json') ? await response.json() : await response.text();

if (!response.ok) {
    const message =
    typeof payload === 'object'
        ? payload?.message ||
        payload?.error ||
        payload?.data?.message ||
        formatApiErrors(payload?.errors)
        : payload;
    throw new Error(message || `Request failed with status ${response.status}.`);
}

return payload;
} catch (error) {
if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
    throw new Error(
    'Unable to connect to the server. Render backend may be spinning up from cold sleep or CORS is blocking the request.'
    );
}
throw error;
}
}

export function unwrapData(payload) {
if (payload && typeof payload === 'object' && 'data' in payload) return payload.data;
return payload;
}

export { API_URL };