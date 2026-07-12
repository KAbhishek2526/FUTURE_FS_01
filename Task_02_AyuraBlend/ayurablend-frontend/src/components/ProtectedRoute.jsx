import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Silent Buffer State: Don't redirect while checking local storage tokens on refresh
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F1EA]/30 flex items-center justify-center font-sans">
        <p className="text-xs uppercase tracking-widest text-neutral-400 animate-pulse">
          Verifying credentials...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated Guard: Redirect to login page and save their attempted destination
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Authorization Role Guard: Block standard customers from structural admin tools
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />; // Redirect standard customers to home page instead of /profile if profile is not defined
  }

  // 4. Access Granted: Render protected page
  return children;
}
