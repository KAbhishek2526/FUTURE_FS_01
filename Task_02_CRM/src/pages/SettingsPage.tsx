import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
        style={{ background: 'var(--c-surface-2)' }}
      >
        <Settings size={26} style={{ color: 'var(--c-muted)' }} />
      </div>
      <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--c-text)' }}>
        Settings
      </h2>
      <p className="text-sm" style={{ color: 'var(--c-muted)' }}>
        Coming soon — user preferences and API configuration.
      </p>
    </div>
  );
}
