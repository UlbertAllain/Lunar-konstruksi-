export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
  "spam",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type LeadSource = "contact-form";

export interface LeadStatusHistoryEntry {
  status: LeadStatus;
  atMs: number;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  projectType: string;
  location: string;
  message: string;
  source: LeadSource;
  status: LeadStatus;
  adminNote: string;
  createdAtMs: number;
  updatedAtMs: number;
  statusHistory: LeadStatusHistoryEntry[];
}

export interface CreateLeadInput {
  name: string;
  phone: string;
  email?: string;
  projectType: string;
  location: string;
  message: string;
}

export interface UpdateLeadInput {
  status?: LeadStatus;
  adminNote?: string;
}

export interface PublicLeadPayload extends CreateLeadInput {
  website?: string;
  startedAt?: number;
}

export interface LeadListOptions {
  status?: LeadStatus;
  limit?: number;
}