// Shared TypeScript types for the CRM

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Won' | 'Lost';
export type LeadSource = 'Website' | 'Referral' | 'Social Media' | 'Advertisement' | 'Cold Call' | 'Other';

export interface Note {
  _id: string;
  text: string;
  addedBy: string;
  createdAt: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  product: string;
  value: number;
  notes: Note[];
  createdAt: string;
  updatedAt: string;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone?: string;
  source?: LeadSource;
  status?: LeadStatus;
  product?: string;
  value?: number;
}
