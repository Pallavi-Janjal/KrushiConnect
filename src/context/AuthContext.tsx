import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService, ReturnIntent } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<User>;
  register: (data: { name: string; email: string; phone: string; role: UserRole; location: string; password?: string }) => Promise<User>;
  logout: () => void;
  returnIntent: ReturnIntent | null;
  saveReturnIntent: (intent: ReturnIntent) => void;
  clearReturnIntent: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [returnIntent, setReturnIntentState] = useState<ReturnIntent | null>(null);

  useEffect(() => {
    // Try to restore session from JWT stored in localStorage
    const intent = authService.getReturnIntent();
    setReturnIntentState(intent);

    authService.fetchMe()
      .then(u => {
        setUser(u);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (email: string, pass: string): Promise<User> => {
    const u = await authService.login(email, pass);
    setUser(u);
    return u;
  };

  const register = async (data: { name: string; email: string; phone: string; role: UserRole; location: string; password?: string }): Promise<User> => {
    const u = await authService.register(data);
    setUser(u);
    return u;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const saveReturnIntent = (intent: ReturnIntent) => {
    authService.setReturnIntent(intent);
    setReturnIntentState(intent);
  };

  const clearReturnIntent = () => {
    authService.clearReturnIntent();
    setReturnIntentState(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      returnIntent,
      saveReturnIntent,
      clearReturnIntent
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
