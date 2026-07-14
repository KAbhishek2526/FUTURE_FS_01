import { useState, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, BarChart3, Settings,
  Bell, Menu, X, LogOut, Wifi, WifiOff, Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApiStatus } from '../hooks/useApiStatus';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard'         },
  { icon: Users,           label: 'Leads',     to: '/dashboard/leads'   },
  { icon: BarChart3,       label: 'Analytics', to: '/dashboard/analytics'},
  { icon: Settings,        label: 'Settings',  to: '/dashboard/settings' },
];

/* ── Connection Status Indicator ─────────────────────────── */
function ConnectionStatus() {
  const { status, recheck } = useApiStatus();

  const config = {
    checking: { dot: '#FCD34D', label: 'Checking…', Icon: Loader2, spin: true  },
    online:   { dot: '#10B981', label: 'API Online',  Icon: Wifi,    spin: false },
    offline:  { dot: '#EF4444', label: 'API Offline', Icon: WifiOff, spin: false },
  }[status];

  return (
    <button
      onClick={recheck}
      title="Click to recheck backend connection"
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors text-xs font-medium"
      style={{
        background: status === 'online'   ? 'var(--s-won-bg)'
                  : status === 'offline'  ? 'var(--s-lost-bg)'
                  : 'var(--c-surface-2)',
        color: status === 'online'  ? 'var(--s-won-text)'
             : status === 'offline' ? 'var(--s-lost-text)'
             : 'var(--c-muted)',
        border: '1px solid var(--c-border)',
      }}
    >
      {/* Pulsing dot */}
      <span className="relative flex h-2 w-2 flex-shrink-0">
        {status === 'online' && (
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
            style={{ background: config.dot }}
          />
        )}
        <span
          className="relative inline-flex rounded-full h-2 w-2"
          style={{ background: config.dot }}
        />
      </span>
      <config.Icon
        size={12}
        className={config.spin ? 'animate-spin' : ''}
      />
      <span className="hidden sm:inline">{config.label}</span>
    </button>
  );
}

/* ── Sidebar nav content ─────────────────────────────────── */
function SidebarContent({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('crm_user');
    navigate('/login', { replace: true });
  };

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('crm_user') ?? '{}'); }
    catch { return {}; }
  })();

  const initials = (user.name ?? 'U')
    .split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="flex items-center justify-between px-4 py-4"
        style={{ borderBottom: '1px solid var(--c-border)' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: 'var(--c-primary)' }}
          >
            C
          </div>
          <span className="font-semibold text-sm" style={{ color: 'var(--c-text)' }}>
            CRM Pro
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="crm-btn-icon border-0"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <p
          className="px-3 pt-1 pb-2 text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--c-muted)' }}
        >
          Navigation
        </p>
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-100 w-full ${
                isActive ? 'active-nav' : ''
              }`
            }
            style={({ isActive }) => ({
              background: isActive ? 'var(--c-primary-bg)' : 'transparent',
              color:      isActive ? 'var(--c-primary)'    : 'var(--c-muted)',
            })}
            onMouseEnter={e => {
              const el = e.currentTarget;
              if (!el.classList.contains('active-nav')) {
                el.style.background = 'var(--c-surface-2)';
              }
            }}
            onMouseLeave={e => {
              const el = e.currentTarget;
              if (!el.classList.contains('active-nav')) {
                el.style.background = 'transparent';
              }
            }}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div
        className="px-4 py-3"
        style={{ borderTop: '1px solid var(--c-border)' }}
      >
        <div className="flex items-center gap-2.5 mb-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
            style={{ background: 'var(--c-primary)' }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium truncate" style={{ color: 'var(--c-text)' }}>
              {user.name ?? 'User'}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--c-muted)' }}>
              {user.role ?? 'Agent'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="crm-btn-secondary w-full justify-center text-xs py-1.5"
          id="logout-btn"
        >
          <LogOut size={13} /> Sign Out
        </button>
      </div>
    </div>
  );
}

/* ── Layout Shell ────────────────────────────────────────── */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('crm_user') ?? '{}'); }
    catch { return {}; }
  })();
  const initials = (user.name ?? 'U')
    .split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--c-bg)' }}>

      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-56 flex-shrink-0"
        style={{
          background:   'var(--c-surface)',
          borderRight:  '1px solid var(--c-border)',
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile off-canvas drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-30 md:hidden"
              style={{ background: 'rgba(0,0,0,0.3)' }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: -224 }}
              animate={{ x: 0 }}
              exit={{ x: -224 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed top-0 left-0 z-40 h-full w-56 md:hidden"
              style={{
                background:  'var(--c-surface)',
                borderRight: '1px solid var(--c-border)',
                boxShadow:   'var(--shadow-lg)',
              }}
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Topbar */}
        <header
          className="flex items-center justify-between px-4 md:px-6 py-3 flex-shrink-0"
          style={{
            background:   'var(--c-surface)',
            borderBottom: '1px solid var(--c-border)',
            boxShadow:    'var(--shadow-sm)',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              className="crm-btn-icon border-0 md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:block">
              <p className="text-sm font-semibold" style={{ color: 'var(--c-text)' }}>
                AyuraBlend CRM
              </p>
            </div>
            <span className="text-sm font-semibold md:hidden" style={{ color: 'var(--c-text)' }}>
              CRM Pro
            </span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Connection status badge */}
            <ConnectionStatus />

            <button className="relative crm-btn-icon border-0" aria-label="Notifications">
              <Bell size={17} />
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full border-2 border-white"
                style={{ background: 'var(--c-primary)' }}
              />
            </button>

            {/* Avatar mobile */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white md:hidden"
              style={{ background: 'var(--c-primary)' }}
            >
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
