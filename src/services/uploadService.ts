const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const uploadService = {
  uploadImages: async (files: File[]): Promise<string[]> => {
    if (!files || files.length === 0) return [];

    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const token = localStorage.getItem('krushi_auth_token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers,
      body: formData
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Image upload failed');
    }

    const data = await response.json();
    return data.urls || [data.url];
  }
};
