import React from 'react';
import { Route } from 'react-router-dom';

// Lazy load pages for performance
const DashboardPage = React.lazy(() => import('./dashboard/page'));
const AdminOverview = React.lazy(() => import('./admin/page'));
const UserManagement = React.lazy(() => import('./admin/users/page'));
const AnalyticsPage = React.lazy(() => import('./admin/analytics/page'));
const ContentManagement = React.lazy(() => import('./admin/content/page'));
const AdminSettings = React.lazy(() => import('./admin/settings/page'));

// Auxiliary Pages
const AboutCreator = React.lazy(() => import('../pages/AboutCreator'));
const PrivacyPolicy = React.lazy(() => import('../pages/PrivacyPolicy'));

/**
 * Integration Routes
 * 
 * Usage in App.jsx:
 * import { DashboardRoutes } from './app/routes';
 * ...
 * <Routes>
 *   {DashboardRoutes}
 * </Routes>
 */

export const DashboardRoutes = [
    <Route 
        key="dashboard-new"
        path="/dashboard-new" 
        element={
            <React.Suspense fallback={<div>Loading Dashboard...</div>}>
                <DashboardPage />
            </React.Suspense>
        } 
    />,
    <Route 
        key="admin-root"
        path="/admin" 
        element={
            <React.Suspense fallback={<div>Loading Admin Panel...</div>}>
                <AdminOverview />
            </React.Suspense>
        } 
    />,
    <Route 
        key="admin-users"
        path="/admin/users" 
        element={
            <React.Suspense fallback={<div>Loading...</div>}>
                <UserManagement />
            </React.Suspense>
        } 
    />,
    <Route 
        key="admin-analytics"
        path="/admin/analytics" 
        element={
            <React.Suspense fallback={<div>Loading...</div>}>
                <AnalyticsPage />
            </React.Suspense>
        } 
    />,
    <Route 
        key="admin-content"
        path="/admin/content" 
        element={
            <React.Suspense fallback={<div>Loading...</div>}>
                <ContentManagement />
            </React.Suspense>
        } 
    />,
    <Route 
        key="admin-settings"
        path="/admin/settings" 
        element={
            <React.Suspense fallback={<div>Loading...</div>}>
                <AdminSettings />
            </React.Suspense>
        } 
    />,
    <Route 
        key="about"
        path="/about" 
        element={
            <React.Suspense fallback={<div>Loading...</div>}>
                <AboutCreator />
            </React.Suspense>
        } 
    />,
    <Route 
        key="privacy"
        path="/privacy" 
        element={
            <React.Suspense fallback={<div>Loading...</div>}>
                <PrivacyPolicy />
            </React.Suspense>
        } 
    />
];
