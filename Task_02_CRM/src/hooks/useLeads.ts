import { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosClient';
import type { Lead, LeadFormData, LeadStatus } from '../utils/types';

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async (params?: Record<string, string>) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<Lead[]>('/leads', { params });
      setLeads(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch leads.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const createLead = async (formData: LeadFormData): Promise<Lead> => {
    const { data } = await api.post<Lead>('/leads', formData);
    setLeads(prev => [data, ...prev]);
    return data;
  };

  const updateStatus = async (id: string, status: LeadStatus): Promise<Lead> => {
    const { data } = await api.put<Lead>(`/leads/${id}/status`, { status });
    setLeads(prev => prev.map(l => (l._id === id ? data : l)));
    return data;
  };

  const addNote = async (id: string, text: string): Promise<Lead> => {
    const { data } = await api.post<Lead>(`/leads/${id}/notes`, { text });
    setLeads(prev => prev.map(l => (l._id === id ? data : l)));
    return data;
  };

  const deleteLead = async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
    setLeads(prev => prev.filter(l => l._id !== id));
  };

  return { leads, loading, error, fetchLeads, createLead, updateStatus, addNote, deleteLead };
}
