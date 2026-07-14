import { useState } from 'react';
import LeadsTable from '../components/LeadsTable';
import LeadModal from '../components/LeadModal';
import { useLeads } from '../hooks/useLeads';
import type { Lead } from '../utils/types';

export default function LeadsPage() {
  const {
    leads, loading, error,
    fetchLeads, createLead, updateStatus, addNote, deleteLead,
  } = useLeads();

  const [selectedLead, setSelectedLead] = useState<Lead | null | undefined>(undefined);
  const isModalOpen = selectedLead !== undefined;

  return (
    <>
      <div className="mb-5">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--c-text)' }}>
          Lead Management
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--c-muted)' }}>
          Track, manage, and convert your sales pipeline.
        </p>
      </div>

      <LeadsTable
        leads={leads}
        loading={loading}
        error={error}
        onSelectLead={lead => setSelectedLead(lead)}
        onDeleteLead={deleteLead}
        onRefresh={fetchLeads}
        onAddNew={() => setSelectedLead(null)}
      />

      <LeadModal
        lead={selectedLead ?? null}
        isOpen={isModalOpen}
        onClose={() => setSelectedLead(undefined)}
        onUpdateStatus={updateStatus}
        onAddNote={addNote}
        onCreateLead={createLead}
      />
    </>
  );
}
