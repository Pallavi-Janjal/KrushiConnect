import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { MarketplacePage } from '../pages/public/MarketplacePage';
import { EquipmentDetailPage } from '../pages/public/EquipmentDetailPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

// Farmer Pages
import { FarmerDashboard } from '../pages/farmer/FarmerDashboard';
import { MyRentalsPage } from '../pages/farmer/MyRentalsPage';
import { SmartMatchPage } from '../pages/farmer/SmartMatchPage';
import { FarmPlanningPage } from '../pages/farmer/FarmPlanningPage';
import { MandiIntelligencePage } from '../pages/farmer/MandiIntelligencePage';
import { FarmerNotificationsPage } from '../pages/farmer/FarmerNotificationsPage';
import { FarmerReceiptsPage } from '../pages/farmer/FarmerReceiptsPage';

// Owner Pages
import { OwnerDashboard } from '../pages/owner/OwnerDashboard';
import { MyEquipmentPage } from '../pages/owner/MyEquipmentPage';
import { AddEquipmentPage } from '../pages/owner/AddEquipmentPage';
import { MaintenancePage } from '../pages/owner/MaintenancePage';
import { UsageLoggingPage } from '../pages/owner/UsageLoggingPage';
import { AnalyticsPage } from '../pages/owner/AnalyticsPage';
import { ReceiptsPage } from '../pages/owner/ReceiptsPage';
import { OwnerNotificationsPage } from '../pages/owner/OwnerNotificationsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/equipment" element={<MarketplacePage />} />
        <Route path="/equipment/:id" element={<EquipmentDetailPage />} />
        <Route path="/mandi" element={<ProtectedRoute><MandiIntelligencePage /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Farmer Protected Routes */}
        <Route path="/farmer/dashboard" element={<ProtectedRoute allowedRoles={['FARMER']}><FarmerDashboard /></ProtectedRoute>} />
        <Route path="/farmer/rentals" element={<ProtectedRoute allowedRoles={['FARMER']}><MyRentalsPage /></ProtectedRoute>} />
        <Route path="/farmer/receipts" element={<ProtectedRoute allowedRoles={['FARMER']}><FarmerReceiptsPage /></ProtectedRoute>} />
        <Route path="/farmer/smart-match" element={<ProtectedRoute><SmartMatchPage /></ProtectedRoute>} />
        <Route path="/farmer/planning" element={<ProtectedRoute allowedRoles={['FARMER']}><FarmPlanningPage /></ProtectedRoute>} />
        <Route path="/farmer/mandi" element={<ProtectedRoute><MandiIntelligencePage /></ProtectedRoute>} />
        <Route path="/farmer/notifications" element={<ProtectedRoute allowedRoles={['FARMER']}><FarmerNotificationsPage /></ProtectedRoute>} />

        {/* Owner Protected Routes */}
        <Route path="/owner/dashboard" element={<ProtectedRoute allowedRoles={['EQUIPMENT_OWNER']}><OwnerDashboard /></ProtectedRoute>} />
        <Route path="/owner/equipment" element={<ProtectedRoute allowedRoles={['EQUIPMENT_OWNER']}><MyEquipmentPage /></ProtectedRoute>} />
        <Route path="/owner/equipment/add" element={<ProtectedRoute allowedRoles={['EQUIPMENT_OWNER']}><AddEquipmentPage /></ProtectedRoute>} />
        <Route path="/owner/maintenance" element={<ProtectedRoute allowedRoles={['EQUIPMENT_OWNER']}><MaintenancePage /></ProtectedRoute>} />
        <Route path="/owner/usage" element={<ProtectedRoute allowedRoles={['EQUIPMENT_OWNER']}><UsageLoggingPage /></ProtectedRoute>} />
        <Route path="/owner/analytics" element={<ProtectedRoute allowedRoles={['EQUIPMENT_OWNER']}><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/owner/receipts" element={<ProtectedRoute allowedRoles={['EQUIPMENT_OWNER']}><ReceiptsPage /></ProtectedRoute>} />
        <Route path="/owner/notifications" element={<ProtectedRoute allowedRoles={['EQUIPMENT_OWNER']}><OwnerNotificationsPage /></ProtectedRoute>} />

        {/* Wildcard Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Route>
    </Routes>
  );
};
