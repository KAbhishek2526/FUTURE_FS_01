import { BarChart2 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
        style={{ background: 'var(--c-primary-bg)' }}
      >
        <BarChart2 size={26} style={{ color: 'var(--c-primary)' }} />
      </div>
      <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--c-text)' }}>
        Analytics
      </h2>
      <p className="text-sm" style={{ color: 'var(--c-muted)' }}>
        Coming soon — pipeline charts and conversion metrics.
      </p>
    </div>
  );
}
