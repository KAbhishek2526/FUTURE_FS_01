import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

import LoginPage       from './components/LoginPage';
import DashboardLayout  from './components/DashboardLayout';
import LeadsPage        from './pages/LeadsPage';
import AnalyticsPage    from './pages/AnalyticsPage';
import SettingsPage     from './pages/SettingsPage';
import ChatInterface    from './components/ChatInterface';

/* ── Auth helpers ────────────────────────────────────────── */
function getUser() {
  try { return JSON.parse(localStorage.getItem('crm_user') ?? 'null'); }
  catch { return null; }
}

/* ── Protected route wrapper ─────────────────────────────── */
function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  if (!getUser()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

/* ── Dashboard shell with nested routes ──────────────────── */
function DashboardShell() {
  return (
    <DashboardLayout>
      <Routes>
        {/* /dashboard → redirect to /dashboard/leads */}
        <Route index element={<Navigate to="leads" replace />} />
        <Route path="leads"     element={<LeadsPage />}     />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings"  element={<SettingsPage />}  />
        {/* catch-all inside dashboard */}
        <Route path="*" element={<Navigate to="leads" replace />} />
      </Routes>
    </DashboardLayout>
  );
}

/* ── Root app ────────────────────────────────────────────── */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected dashboard */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardShell />
            </ProtectedRoute>
          }
        />

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      {/* AI floating chat — rendered outside the layout so it persists across routes */}
      <ChatInterface />
    </BrowserRouter>
  );
}
