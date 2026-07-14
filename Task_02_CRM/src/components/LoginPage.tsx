import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Leaf, ArrowRight, Shield, Zap, BarChart2 } from 'lucide-react';

const DEMO_USER = {
  id: 'demo-001',
  name: 'Abhishek K.',
  role: 'CRM Admin',
  email: 'admin@ayurablend.in',
};

const features = [
  { icon: BarChart2, label: 'Pipeline Overview',   desc: 'Visual stats on every stage' },
  { icon: Zap,       label: 'Instant Updates',     desc: 'Status & notes sync in real-time' },
  { icon: Shield,    label: 'Secure & Private',    desc: 'Role-based access control' },
];

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem('crm_user', JSON.stringify(DEMO_USER));
    navigate('/dashboard', { replace: true });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--c-bg)' }}
    >
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-0 overflow-hidden rounded-xl shadow-lg"
        style={{ border: '1px solid var(--c-border)' }}
      >

        {/* ── Left panel — Branding ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="hidden md:flex flex-col justify-between p-10"
          style={{ background: 'var(--c-primary)' }}
        >
          <div className="flex items-center gap-2">
            <Leaf size={20} className="text-white opacity-90" />
            <span className="text-white font-semibold text-sm opacity-90">AyuraBlend CRM</span>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white leading-snug mb-3">
              Manage your<br />leads with clarity.
            </h1>
            <p className="text-blue-100 text-sm leading-relaxed">
              Track every prospect, update pipeline stages, and keep your team aligned — all in one place.
            </p>

            <ul className="mt-8 space-y-4">
              {features.map(({ icon: Icon, label, desc }) => (
                <li key={label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={15} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="text-xs text-blue-200">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-blue-200 opacity-70">
            © 2025 AyuraBlend · FUTURE_FS_01 Internship — Task 02
          </p>
        </motion.div>

        {/* ── Right panel — Login form ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="flex flex-col justify-center px-8 py-10 md:px-12"
          style={{ background: 'var(--c-surface)' }}
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 md:hidden">
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold"
              style={{ background: 'var(--c-primary)' }}>
              C
            </div>
            <span className="font-semibold text-sm" style={{ color: 'var(--c-text)' }}>AyuraBlend CRM</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-1.5" style={{ color: 'var(--c-text)' }}>
              Welcome back
            </h2>
            <p className="text-sm" style={{ color: 'var(--c-muted)' }}>
              Sign in to access your CRM dashboard.
            </p>
          </div>

          {/* Demo credentials notice */}
          <div
            className="flex items-start gap-2.5 px-3 py-3 rounded-md mb-6 text-sm"
            style={{ background: 'var(--c-primary-bg)', border: '1px solid #BFDBFE' }}
          >
            <Shield size={15} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--c-primary)' }} />
            <div>
              <p className="font-medium" style={{ color: 'var(--c-primary)' }}>Demo Mode Active</p>
              <p className="text-xs mt-0.5" style={{ color: '#3B82F6' }}>
                Click "Sign In" to authenticate as <strong>admin@ayurablend.in</strong>
              </p>
            </div>
          </div>

          {/* Email field (display only for realism) */}
          <div className="space-y-3 mb-4">
            <div>
              <label className="crm-label">Email Address</label>
              <input
                id="login-email"
                type="email"
                defaultValue="admin@ayurablend.in"
                readOnly
                className="crm-input"
                style={{ background: 'var(--c-surface-2)', cursor: 'default' }}
              />
            </div>
            <div>
              <label className="crm-label">Password</label>
              <input
                id="login-password"
                type="password"
                defaultValue="••••••••••"
                readOnly
                className="crm-input"
                style={{ background: 'var(--c-surface-2)', cursor: 'default' }}
              />
            </div>
          </div>

          <button
            id="login-submit"
            onClick={handleLogin}
            className="crm-btn-primary w-full justify-center py-2.5 text-base mt-2"
          >
            Sign In
            <ArrowRight size={16} />
          </button>

          <p className="text-center text-xs mt-6" style={{ color: 'var(--c-muted)' }}>
            This is a demo environment. No real credentials required.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
