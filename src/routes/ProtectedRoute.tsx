import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading, saveReturnIntent } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#166534] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    // Synchronously save return intent so user is redirected back after login
    const targetPath = location.pathname + location.search;
    if (targetPath && targetPath !== '/login' && targetPath !== '/register') {
      saveReturnIntent({ returnTo: targetPath });
    }
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'FARMER') {
      return <Navigate to="/farmer/dashboard" replace />;
    } else {
      return <Navigate to="/owner/dashboard" replace />;
    }
  }

  return children;
};

