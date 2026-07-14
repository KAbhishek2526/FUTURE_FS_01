import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Trash2, ChevronDown, RefreshCw, Loader2, TrendingUp, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Lead, LeadStatus } from '../utils/types';

/* ── Status configuration ────────────────────────────────── */
const STATUS_CONFIG: Record<LeadStatus, { bg: string; text: string }> = {
  New:             { bg: 'var(--s-new-bg)',      text: 'var(--s-new-text)'      },
  Contacted:       { bg: 'var(--s-contacted-bg)', text: 'var(--s-contacted-text)'},
  Qualified:       { bg: 'var(--s-qualified-bg)', text: 'var(--s-qualified-text)'},
  'Proposal Sent': { bg: 'var(--s-proposal-bg)',  text: 'var(--s-proposal-text)' },
  Won:             { bg: 'var(--s-won-bg)',        text: 'var(--s-won-text)'      },
  Lost:            { bg: 'var(--s-lost-bg)',       text: 'var(--s-lost-text)'     },
};

const ALL_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];

interface LeadsTableProps {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  onSelectLead: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
  onRefresh: () => void;
  onAddNew: () => void;
}

/* ── Avatar initials helper ─────────────────────────────── */
function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0 select-none"
      style={{ background: 'var(--c-primary)' }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

/* ── Status badge ────────────────────────────────────────── */
function StatusBadge({ status }: { status: LeadStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="crm-badge"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      {status}
    </span>
  );
}

export default function LeadsTable({
  leads, loading, error, onSelectLead, onDeleteLead, onRefresh, onAddNew,
}: LeadsTableProps) {
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter]   = useState<LeadStatus | 'All'>('All');
  const [deletingId, setDeletingId]       = useState<string | null>(null);
  const [importing, setImporting]         = useState(false);
  const [importResult, setImportResult]   = useState<{ ok: boolean; msg: string } | null>(null);
  const fileInputRef                      = useRef<HTMLInputElement>(null);

  /* ── Filtering ───────────────────────────────────────── */
  const filtered = leads.filter(lead => {
    const q = search.toLowerCase();
    const matchesSearch =
      lead.name.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      (lead.phone ?? '').includes(search);
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  /* ── CSV import handler ─────────────────────────────── */
  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportResult(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/leads/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        setImportResult({ ok: true, msg: `✓ Imported ${data.inserted} lead${data.inserted !== 1 ? 's' : ''} (${data.skipped} duplicates skipped)` });
        onRefresh();
      } else {
        setImportResult({ ok: false, msg: data.message || 'Upload failed.' });
      }
    } catch {
      setImportResult({ ok: false, msg: 'Network error — is the backend running?' });
    } finally {
      setImporting(false);
      // Reset input so same file can be re-uploaded
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setImportResult(null), 6000);
    }
  };

  /* ── Delete handler ──────────────────────────────────── */
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Delete this lead? This action cannot be undone.')) return;
    setDeletingId(id);
    await onDeleteLead(id);
    setDeletingId(null);
  };

  /* ── Stats ───────────────────────────────────────────── */
  const stats = {
    total:      leads.length,
    newCount:   leads.filter(l => l.status === 'New').length,
    won:        leads.filter(l => l.status === 'Won').length,
    totalValue: leads.reduce((s, l) => s + (l.value ?? 0), 0),
  };

  const statCards = [
    { label: 'Total Leads',     value: stats.total,                                         accent: 'var(--c-primary)'  },
    { label: 'New',             value: stats.newCount,                                       accent: 'var(--s-new-text)' },
    { label: 'Won',             value: stats.won,                                            accent: 'var(--s-won-text)' },
    { label: 'Pipeline Value',  value: `₹${stats.totalValue.toLocaleString('en-IN')}`,      accent: '#92400E'            },
  ];

  /* ── Render ──────────────────────────────────────────── */
  return (
    <div className="space-y-4">

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {statCards.map(({ label, value, accent }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
            className="crm-card px-4 py-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="crm-label">{label}</p>
                <p className="text-2xl font-semibold mt-0.5" style={{ color: 'var(--c-text)' }}>
                  {value}
                </p>
              </div>
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ background: accent + '18', color: accent }}
              >
                <TrendingUp size={15} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div
        className="crm-card px-4 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
      >
        {/* Search input */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-md flex-1 min-w-0"
          style={{ border: '1px solid var(--c-border)', background: 'var(--c-surface)' }}
        >
          <Search size={14} style={{ color: 'var(--c-muted)', flexShrink: 0 }} />
          <input
            id="lead-search"
            type="text"
            placeholder="Search by name, email or phone…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm min-w-0"
            style={{ color: 'var(--c-text)' }}
          />
        </div>

        {/* Status filter */}
        <div className="relative flex-shrink-0">
          <select
            id="status-filter"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as LeadStatus | 'All')}
            className="crm-input appearance-none pr-8 w-full sm:w-auto cursor-pointer"
            style={{ paddingTop: '0.45rem', paddingBottom: '0.45rem' }}
          >
            <option value="All">All Statuses</option>
            {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--c-muted)' }}
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-shrink-0">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            id="csv-file-input"
            type="file"
            accept=".csv,.txt"
            className="hidden"
            onChange={handleCSVUpload}
          />
          <button
            id="import-csv"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            title="Import leads from CSV"
            className="crm-btn-secondary"
          >
            {importing
              ? <Loader2 size={14} className="animate-spin" />
              : <Upload size={14} />}
            <span className="hidden sm:inline">Import CSV</span>
          </button>
          <button
            id="refresh-leads"
            onClick={onRefresh}
            title="Refresh"
            className="crm-btn-icon"
            aria-label="Refresh leads"
          >
            <RefreshCw size={15} />
          </button>
          <button
            id="add-new-lead"
            onClick={onAddNew}
            className="crm-btn-primary"
          >
            <Plus size={15} />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* ── Import result toast ── */}
      <AnimatePresence>
        {importResult && (
          <motion.div
            key="import-toast"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm"
            style={{
              background: importResult.ok ? 'var(--s-won-bg)'  : 'var(--s-lost-bg)',
              color:      importResult.ok ? 'var(--s-won-text)': 'var(--s-lost-text)',
              border: `1px solid ${importResult.ok ? 'var(--c-border)' : '#FECACA'}`,
            }}
          >
            {importResult.ok
              ? <CheckCircle2 size={15} className="flex-shrink-0" />
              : <AlertCircle  size={15} className="flex-shrink-0" />}
            {importResult.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Table / Card List ── */}
      <div className="crm-card overflow-hidden">
        {loading ? (
          <div
            className="flex flex-col items-center justify-center py-24 gap-3"
            style={{ color: 'var(--c-muted)' }}
          >
            <Loader2 size={24} className="animate-spin" style={{ color: 'var(--c-primary)' }} />
            <span className="text-sm">Loading leads…</span>
          </div>
        ) : error ? (
          <div className="py-24 px-6 text-center">
            <p
              className="text-sm font-medium"
              style={{ color: 'var(--s-lost-text)' }}
            >
              {error}
            </p>
            <p className="text-xs mt-1.5" style={{ color: 'var(--c-muted)' }}>
              Make sure the backend is running at{' '}
              <code
                className="px-1 py-0.5 rounded text-xs"
                style={{ background: 'var(--c-surface-2)', color: 'var(--c-text)' }}
              >
                localhost:5001
              </code>
            </p>
          </div>
        ) : (
          <>
            {/* ── Desktop table (≥640px) ── */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm border-collapse min-w-[640px]">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--c-border)', background: 'var(--c-surface-2)' }}>
                    {['Name', 'Email', 'Source', 'Status', 'Value', 'Notes', ''].map(h => (
                      <th
                        key={h}
                        className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                        style={{ color: 'var(--c-muted)' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-20 text-center text-sm"
                          style={{ color: 'var(--c-muted)' }}
                        >
                          No leads match your filters.{' '}
                          <button
                            onClick={onAddNew}
                            className="font-medium underline underline-offset-2"
                            style={{ color: 'var(--c-primary)' }}
                          >
                            Add one now
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((lead, idx) => (
                        <motion.tr
                          key={lead._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.18, delay: idx * 0.03 }}
                          onClick={() => onSelectLead(lead)}
                          className="cursor-pointer transition-colors duration-100"
                          style={{ borderBottom: '1px solid var(--c-border)' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--c-surface-2)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          {/* Name */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <Avatar name={lead.name} />
                              <span className="font-medium text-sm" style={{ color: 'var(--c-text)' }}>
                                {lead.name}
                              </span>
                            </div>
                          </td>
                          {/* Email */}
                          <td className="px-4 py-3 text-sm" style={{ color: 'var(--c-text-2)' }}>
                            {lead.email}
                          </td>
                          {/* Source */}
                          <td className="px-4 py-3 text-sm" style={{ color: 'var(--c-muted)' }}>
                            {lead.source}
                          </td>
                          {/* Status */}
                          <td className="px-4 py-3">
                            <StatusBadge status={lead.status} />
                          </td>
                          {/* Value */}
                          <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--c-text)' }}>
                            {lead.value ? `₹${lead.value.toLocaleString('en-IN')}` : '—'}
                          </td>
                          {/* Notes */}
                          <td className="px-4 py-3 text-sm" style={{ color: 'var(--c-muted)' }}>
                            {lead.notes.length > 0
                              ? `${lead.notes.length} note${lead.notes.length > 1 ? 's' : ''}`
                              : '—'}
                          </td>
                          {/* Delete */}
                          <td className="px-4 py-3">
                            <button
                              id={`delete-lead-${lead._id}`}
                              onClick={e => handleDelete(e, lead._id)}
                              className="p-1.5 rounded transition-colors"
                              style={{
                                color: deletingId === lead._id ? 'var(--s-lost-text)' : 'var(--c-muted)',
                              }}
                              title="Delete lead"
                              onMouseEnter={e => (e.currentTarget.style.background = 'var(--s-lost-bg)')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                              {deletingId === lead._id
                                ? <Loader2 size={14} className="animate-spin" />
                                : <Trash2 size={14} />}
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* ── Mobile card list (<640px) ── */}
            <div className="sm:hidden">
              {filtered.length === 0 ? (
                <div className="py-16 text-center px-4" style={{ color: 'var(--c-muted)' }}>
                  <p className="text-sm">No leads match your filters.</p>
                  <button
                    onClick={onAddNew}
                    className="crm-btn-primary mt-3 mx-auto"
                  >
                    <Plus size={14} /> Add Lead
                  </button>
                </div>
              ) : (
                <ul className="divide-y" style={{ borderColor: 'var(--c-border)' }}>
                  <AnimatePresence>
                    {filtered.map((lead, idx) => (
                      <motion.li
                        key={lead._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18, delay: idx * 0.04 }}
                        className="flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors"
                        onClick={() => onSelectLead(lead)}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--c-surface-2)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        style={{ borderColor: 'var(--c-border)' }}
                      >
                        <Avatar name={lead.name} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium truncate" style={{ color: 'var(--c-text)' }}>
                              {lead.name}
                            </p>
                            <StatusBadge status={lead.status} />
                          </div>
                          <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--c-muted)' }}>
                            {lead.email}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5 text-xs" style={{ color: 'var(--c-muted)' }}>
                            <span>{lead.source}</span>
                            {lead.value ? (
                              <span className="font-medium" style={{ color: 'var(--c-text-2)' }}>
                                ₹{lead.value.toLocaleString('en-IN')}
                              </span>
                            ) : null}
                            {lead.notes.length > 0 && (
                              <span>{lead.notes.length} note{lead.notes.length > 1 ? 's' : ''}</span>
                            )}
                          </div>
                        </div>
                        <button
                          id={`delete-lead-mobile-${lead._id}`}
                          onClick={e => handleDelete(e, lead._id)}
                          className="p-1.5 rounded mt-0.5 flex-shrink-0"
                          style={{ color: 'var(--c-muted)' }}
                          title="Delete lead"
                          onMouseEnter={e => (e.currentTarget.style.color = 'var(--s-lost-text)')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-muted)')}
                        >
                          {deletingId === lead._id
                            ? <Loader2 size={14} className="animate-spin" />
                            : <Trash2 size={14} />}
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>
          </>
        )}

        {/* Table footer */}
        {!loading && !error && filtered.length > 0 && (
          <div
            className="px-4 py-2.5 flex items-center justify-between text-xs"
            style={{
              borderTop: '1px solid var(--c-border)',
              background: 'var(--c-surface-2)',
              color: 'var(--c-muted)',
            }}
          >
            <span>
              Showing <strong style={{ color: 'var(--c-text-2)' }}>{filtered.length}</strong>
              {' '}of <strong style={{ color: 'var(--c-text-2)' }}>{leads.length}</strong> leads
            </span>
            {statusFilter !== 'All' && (
              <button
                onClick={() => setStatusFilter('All')}
                className="text-xs"
                style={{ color: 'var(--c-primary)' }}
              >
                Clear filter ×
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
