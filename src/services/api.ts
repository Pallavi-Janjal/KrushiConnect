export const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '' && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl;
  }
  return '/api';
};

export const API_BASE_URL = getApiBaseUrl();

export const getCategoryFallbackImage = (category?: string): string => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('harvester')) {
    return 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=800&q=80';
  }
  if (cat.includes('spray')) {
    return 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80';
  }
  if (cat.includes('seed') || cat.includes('drill') || cat.includes('planter')) {
    return 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80';
  }
  if (cat.includes('rotavator') || cat.includes('cultivator') || cat.includes('tiller') || cat.includes('vakar') || cat.includes('plough')) {
    return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80';
  }
  return 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80';
};

export const resolveImageUrl = (url?: string, category?: string): string => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return getCategoryFallbackImage(category);
  }
  // If stored with http://localhost:5000/uploads/... or http://localhost:8000/uploads/...
  if (url.includes('/uploads/')) {
    const filename = url.split('/uploads/')[1];
    return `/uploads/${filename}`;
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

  const baseUrl = getApiBaseUrl();
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

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
