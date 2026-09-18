export const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // In production or when hosted on a domain like Render, use relative /api
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '/api';
  }
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getApiBaseUrl();

export const resolveImageUrl = (url?: string): string => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80';
  }
  // If stored with http://localhost:5000/uploads/...
  if (url.includes('localhost:5000/uploads/') || url.includes('127.0.0.1:5000/uploads/')) {
    const filename = url.split('/uploads/')[1];
    const baseUrl = getApiBaseUrl().replace(/\/api\/?$/, '');
    return baseUrl ? `${baseUrl}/uploads/${filename}` : `/uploads/${filename}`;
  }
  // If relative /uploads/...
  if (url.startsWith('/uploads/')) {
    const baseUrl = getApiBaseUrl().replace(/\/api\/?$/, '');
    return baseUrl ? `${baseUrl}${url}` : url;
  }
  return url;
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('krushi_auth_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('krushi_auth_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('krushi_auth_token');
};

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `API request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}
