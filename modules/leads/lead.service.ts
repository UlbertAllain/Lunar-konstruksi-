import type {
  CreateLeadInput,
  LeadListOptions,
  UpdateLeadInput,
} from "./lead.types";
import {
  createLeadRecord,
  getLeadRecord,
  listLeadRecords,
  updateLeadRecord,
} from "./lead.repository";

function normalizePhone(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeOptional(value?: string) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

export function createLead(input: CreateLeadInput) {
  return createLeadRecord({
    name: input.name.trim(),
    phone: normalizePhone(input.phone),
    email: normalizeOptional(input.email),
    projectType: input.projectType.trim(),
    location: input.location.trim(),
    message: input.message.trim(),
  });
}

export function getLead(id: string) {
  return getLeadRecord(id);
}

export function listLeads(options?: LeadListOptions) {
  return listLeadRecords(options);
}

export function updateLead(id: string, input: UpdateLeadInput) {
  return updateLeadRecord(id, {
    ...input,
    ...(input.adminNote !== undefined
      ? { adminNote: input.adminNote.trim() }
      : {}),
  });
}