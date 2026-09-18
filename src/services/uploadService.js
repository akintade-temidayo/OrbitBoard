import { apiRequest, unwrapData } from '@/services/apiClient';

export async function uploadImage({ dataUrl, fileName = 'upload.jpg', token }) {
if (!dataUrl || !dataUrl.startsWith('data:')) return dataUrl || '';

const response = await fetch(dataUrl);
const blob = await response.blob();
const formData = new FormData();

// MUST be 'file' to match backend upload.single('file')
formData.append('file', blob, fileName);

const payload = unwrapData(
    await apiRequest('/api/upload', {
    method: 'POST',
    body: formData,
    token,
    // Flag if your apiClient requires it to avoid setting application/json headers
    isFormData: true, 
    })
);

return payload?.url || payload?.secure_url || payload;
}