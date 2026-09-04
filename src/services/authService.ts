import { User, UserRole } from '../types';
import { apiRequest, setAuthToken, removeAuthToken, getAuthToken } from './api';

const CURRENT_USER_KEY = 'krushi_current_user';
const RETURN_INTENT_KEY = 'krushi_return_intent';

export interface ReturnIntent {
  returnTo: string;
  action?: string;
  equipmentId?: string;
}

export const authService = {
  getCurrentUser: (): User | null => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  fetchMe: async (): Promise<User | null> => {
    const token = getAuthToken();
    if (!token) return null;

    try {
      const data = await apiRequest<{ user: User }>('/auth/me');
      if (data.user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
        return data.user;
      }
      return null;
    } catch (e) {
      removeAuthToken();
      localStorage.removeItem(CURRENT_USER_KEY);
      return null;
    }
  },

  login: async (email: string, pass: string): Promise<User> => {
    const response = await apiRequest<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pass })
    });

    if (response.token) {
      setAuthToken(response.token);
    }

    if (response.user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(response.user));
    }

    return response.user;
  },

  register: async (userData: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    location: string;
    password?: string;
  }): Promise<User> => {
    const response = await apiRequest<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        ...userData,
        password: userData.password || 'Password@123'
      })
    });

    if (response.token) {
      setAuthToken(response.token);
    }

    if (response.user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(response.user));
    }

    return response.user;
  },

  logout: (): void => {
    try {
      apiRequest('/auth/logout', { method: 'POST' }).catch(() => {});
    } catch {}
    removeAuthToken();
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  setReturnIntent: (intent: ReturnIntent): void => {
    localStorage.setItem(RETURN_INTENT_KEY, JSON.stringify(intent));
  },

  getReturnIntent: (): ReturnIntent | null => {
    try {
      const stored = localStorage.getItem(RETURN_INTENT_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  clearReturnIntent: (): void => {
    localStorage.removeItem(RETURN_INTENT_KEY);
  }
};
