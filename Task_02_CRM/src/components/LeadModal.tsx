import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Send, Loader2, StickyNote, User, Mail, Phone, Tag, DollarSign, ChevronDown,
} from 'lucide-react';
import type { Lead, LeadStatus, LeadSource, LeadFormData } from '../utils/types';

const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
const SOURCES:  LeadSource[] = ['Website', 'Referral', 'Social Media', 'Advertisement', 'Cold Call', 'Other'];

const STATUS_CONFIG: Record<LeadStatus, { bg: string; text: string; border: string }> = {
  New:             { bg: 'var(--s-new-bg)',       text: 'var(--s-new-text)',       border: '#BFDBFE' },
  Contacted:       { bg: 'var(--s-contacted-bg)', text: 'var(--s-contacted-text)', border: '#FDE68A' },
  Qualified:       { bg: 'var(--s-qualified-bg)', text: 'var(--s-qualified-text)', border: '#BBF7D0' },
  'Proposal Sent': { bg: 'var(--s-proposal-bg)',  text: 'var(--s-proposal-text)',  border: '#DDD6FE' },
  Won:             { bg: 'var(--s-won-bg)',        text: 'var(--s-won-text)',        border: '#A7F3D0' },
  Lost:            { bg: 'var(--s-lost-bg)',       text: 'var(--s-lost-text)',       border: '#FECACA' },
};

interface LeadModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: LeadStatus) => Promise<Lead>;
  onAddNote: (id: string, text: string) => Promise<Lead>;
  onCreateLead: (data: LeadFormData) => Promise<Lead>;
}

/* ── Shared field label ─────────────────────────────────── */
function FieldLabel({ icon: Icon, text, required }: { icon: React.ElementType; text: string; required?: boolean }) {
  return (
    <label className="crm-label flex items-center gap-1">
      <Icon size={11} />
      {text}{required && <span style={{ color: 'var(--s-lost-text)' }}> *</span>}
    </label>
  );
}

/* ── Detail field (edit mode) ───────────────────────────── */
function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="crm-label">{label}</p>
      <p className="text-sm" style={{ color: 'var(--c-text)' }}>{value}</p>
    </div>
  );
}

export default function LeadModal({
  lead, isOpen, onClose, onUpdateStatus, onAddNote, onCreateLead,
}: LeadModalProps) {
  const isCreateMode = lead === null;

  /* ── Form state ── */
  const [form, setForm] = useState<LeadFormData>({
    name: '', email: '', phone: '', source: 'Other', status: 'New', product: '', value: 0,
  });
  const [formError, setFormError] = useState('');
  const [creating, setCreating]   = useState(false);

  /* ── Edit-mode state ── */
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus>('New');
  const [updatingStatus, setUpdatingStatus]  = useState(false);
  const [noteText, setNoteText]              = useState('');
  const [addingNote, setAddingNote]          = useState(false);

  /* ── Sync on open ── */
  useEffect(() => {
    if (lead) setSelectedStatus(lead.status);
    if (isCreateMode) {
      setForm({ name: '', email: '', phone: '', source: 'Other', status: 'New', product: '', value: 0 });
      setFormError('');
    }
  }, [lead, isCreateMode, isOpen]);

  if (!isOpen) return null;

  /* ── Handlers ── */
  const handleStatusChange = async (status: LeadStatus) => {
    if (!lead) return;
    setSelectedStatus(status);
    setUpdatingStatus(true);
    try { await onUpdateStatus(lead._id, status); }
    finally { setUpdatingStatus(false); }
  };

  const handleAddNote = async () => {
    if (!lead || !noteText.trim()) return;
    setAddingNote(true);
    try { await onAddNote(lead._id, noteText); setNoteText(''); }
    finally { setAddingNote(false); }
  };

  const handleCreate = async () => {
    if (!form.name?.trim() || !form.email?.trim()) {
      setFormError('Name and email are required.');
      return;
    }
    setCreating(true);
    try { await onCreateLead(form); onClose(); }
    catch { setFormError('Could not create lead. Is the backend running?'); }
    finally { setCreating(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — subtle, professional */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(17, 24, 39, 0.4)' }}
          />

          {/* Modal panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none"
          >
            <div
              className="w-full sm:max-w-lg pointer-events-auto flex flex-col"
              style={{
                background: 'var(--c-surface)',
                border: '1px solid var(--c-border)',
                borderRadius: '10px 10px 0 0',
                maxHeight: '95vh',
                boxShadow: 'var(--shadow-lg)',
                /* On sm+, override with full rounded corners */
              }}
            >
              {/* ── Header ── */}
              <div
                className="flex items-center justify-between px-5 py-4 flex-shrink-0"
                style={{ borderBottom: '1px solid var(--c-border)' }}
              >
                <div>
                  <h2 className="text-base font-semibold" style={{ color: 'var(--c-text)' }}>
                    {isCreateMode ? 'New Lead' : lead?.name}
                  </h2>
                  {!isCreateMode && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--c-muted)' }}>
                      {lead?.email}
                    </p>
                  )}
                </div>
                <button
                  id="modal-close"
                  onClick={onClose}
                  className="crm-btn-icon border-0"
                  aria-label="Close modal"
                >
                  <X size={17} />
                </button>
              </div>

              {/* ── Scrollable body ── */}
              <div className="overflow-y-auto flex-1 px-5 py-5 space-y-5">

                {/* ══ CREATE MODE ══ */}
                {isCreateMode ? (
                  <div className="space-y-4">
                    {formError && (
                      <div
                        className="flex items-start gap-2 px-3 py-2.5 rounded-md text-sm"
                        style={{ background: 'var(--s-lost-bg)', color: 'var(--s-lost-text)' }}
                      >
                        {formError}
                      </div>
                    )}

                    {/* Name */}
                    <div>
                      <FieldLabel icon={User} text="Full Name" required />
                      <input
                        id="lead-name"
                        className="crm-input"
                        placeholder="Jane Doe"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <FieldLabel icon={Mail} text="Email Address" required />
                      <input
                        id="lead-email"
                        type="email"
                        className="crm-input"
                        placeholder="jane@company.com"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <FieldLabel icon={Phone} text="Phone" />
                      <input
                        id="lead-phone"
                        className="crm-input"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      />
                    </div>

                    {/* Source + Status */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="crm-label">Source</label>
                        <div className="relative">
                          <select
                            id="lead-source"
                            className="crm-input appearance-none pr-8 cursor-pointer"
                            value={form.source}
                            onChange={e => setForm(f => ({ ...f, source: e.target.value as LeadSource }))}
                          >
                            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <ChevronDown
                            size={13}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ color: 'var(--c-muted)' }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="crm-label">Status</label>
                        <div className="relative">
                          <select
                            id="lead-status-create"
                            className="crm-input appearance-none pr-8 cursor-pointer"
                            value={form.status}
                            onChange={e => setForm(f => ({ ...f, status: e.target.value as LeadStatus }))}
                          >
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <ChevronDown
                            size={13}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ color: 'var(--c-muted)' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Product + Value */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <FieldLabel icon={Tag} text="Product / Interest" />
                        <input
                          id="lead-product"
                          className="crm-input"
                          placeholder="e.g. Moringa Pack"
                          value={form.product}
                          onChange={e => setForm(f => ({ ...f, product: e.target.value }))}
                        />
                      </div>
                      <div>
                        <FieldLabel icon={DollarSign} text="Deal Value (₹)" />
                        <input
                          id="lead-value"
                          type="number"
                          min={0}
                          className="crm-input"
                          placeholder="0"
                          value={form.value ?? ''}
                          onChange={e => setForm(f => ({ ...f, value: Number(e.target.value) }))}
                        />
                      </div>
                    </div>
                  </div>

                ) : (
                  /* ══ EDIT / DETAIL MODE ══ */
                  <>
                    {/* Contact details grid */}
                    <div
                      className="grid grid-cols-2 gap-x-6 gap-y-3 p-4 rounded-md"
                      style={{ background: 'var(--c-surface-2)', border: '1px solid var(--c-border)' }}
                    >
                      <DetailField label="Email"          value={lead?.email ?? '—'} />
                      <DetailField label="Phone"          value={lead?.phone || '—'} />
                      <DetailField label="Source"         value={lead?.source ?? '—'} />
                      <DetailField label="Product"        value={lead?.product || '—'} />
                      <DetailField
                        label="Pipeline Value"
                        value={lead?.value ? `₹${lead.value.toLocaleString('en-IN')}` : '—'}
                      />
                      <DetailField
                        label="Created"
                        value={lead ? new Date(lead.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        }) : ''}
                      />
                    </div>

                    {/* Status update */}
                    <div>
                      <p className="crm-label mb-2">Pipeline Stage</p>
                      <div className="flex flex-wrap gap-2">
                        {STATUSES.map(s => {
                          const cfg = STATUS_CONFIG[s];
                          const isActive = selectedStatus === s;
                          return (
                            <button
                              key={s}
                              id={`status-btn-${s.replace(/\s/g, '-')}`}
                              onClick={() => handleStatusChange(s)}
                              disabled={updatingStatus}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                              style={{
                                background:   isActive ? cfg.bg      : 'var(--c-surface)',
                                color:        isActive ? cfg.text     : 'var(--c-muted)',
                                border:       `1px solid ${isActive ? cfg.border : 'var(--c-border)'}`,
                                fontWeight:   isActive ? 600 : 400,
                                opacity:      updatingStatus && !isActive ? 0.5 : 1,
                              }}
                            >
                              {updatingStatus && isActive && (
                                <Loader2 size={11} className="animate-spin" />
                              )}
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Notes section */}
                    <div>
                      <p
                        className="crm-label mb-2 flex items-center gap-1.5"
                      >
                        <StickyNote size={11} />
                        Activity Notes
                        {(lead?.notes.length ?? 0) > 0 && (
                          <span
                            className="ml-1 px-1.5 py-0.5 rounded text-xs font-medium"
                            style={{ background: 'var(--c-primary-bg)', color: 'var(--c-primary)' }}
                          >
                            {lead?.notes.length}
                          </span>
                        )}
                      </p>

                      {/* Notes list */}
                      <div
                        className="space-y-2 mb-3"
                        style={{ maxHeight: '9rem', overflowY: 'auto' }}
                      >
                        <AnimatePresence>
                          {(lead?.notes.length ?? 0) === 0 && (
                            <p className="text-sm" style={{ color: 'var(--c-muted)' }}>
                              No notes yet. Add the first one below.
                            </p>
                          )}
                          {[...(lead?.notes ?? [])].reverse().map(note => (
                            <motion.div
                              key={note._id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="px-3 py-2.5 rounded-md text-sm"
                              style={{
                                background: 'var(--c-surface-2)',
                                border: '1px solid var(--c-border)',
                              }}
                            >
                              <p style={{ color: 'var(--c-text)' }}>{note.text}</p>
                              <p className="text-xs mt-1" style={{ color: 'var(--c-muted)' }}>
                                {note.addedBy} · {new Date(note.createdAt).toLocaleString('en-IN', {
                                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                                })}
                              </p>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>

                      {/* Add note */}
                      <div className="flex gap-2">
                        <input
                          id="add-note-input"
                          type="text"
                          value={noteText}
                          onChange={e => setNoteText(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleAddNote()}
                          placeholder="Add a note… press Enter or click Send"
                          className="crm-input flex-1"
                        />
                        <button
                          id="submit-note"
                          onClick={handleAddNote}
                          disabled={!noteText.trim() || addingNote}
                          className="crm-btn-primary"
                          style={{ padding: '0.5rem 0.75rem' }}
                        >
                          {addingNote
                            ? <Loader2 size={15} className="animate-spin" />
                            : <Send size={15} />}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* ── Footer ── */}
              <div
                className="flex justify-end gap-2 px-5 py-4 flex-shrink-0"
                style={{ borderTop: '1px solid var(--c-border)', background: 'var(--c-surface-2)' }}
              >
                <button
                  id="modal-cancel"
                  onClick={onClose}
                  className="crm-btn-secondary"
                >
                  {isCreateMode ? 'Cancel' : 'Close'}
                </button>
                {isCreateMode && (
                  <button
                    id="modal-create-submit"
                    onClick={handleCreate}
                    disabled={creating}
                    className="crm-btn-primary"
                  >
                    {creating && <Loader2 size={14} className="animate-spin" />}
                    Create Lead
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
