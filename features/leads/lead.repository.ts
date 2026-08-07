import {
  FieldValue,
  type DocumentData,
  type UpdateData,
} from "firebase-admin/firestore";

import { getAdminDb } from "@/lib/firebase/admin";

import type {
  CreateLeadInput,
  Lead,
  LeadListOptions,
  LeadStatus,
  LeadStatusHistoryEntry,
  UpdateLeadInput,
} from "./lead.types";

const COLLECTION = "leads";

type StoredLead = Omit<Lead, "id"> & {
  createdAt?: unknown;
  updatedAt?: unknown;
};

function mapLead(id: string, data: DocumentData): Lead {
  return {
    id,
    name: String(data.name ?? ""),
    phone: String(data.phone ?? ""),
    email: data.email ? String(data.email) : undefined,
    projectType: String(data.projectType ?? ""),
    location: String(data.location ?? ""),
    message: String(data.message ?? ""),
    source: "contact-form",
    status: (data.status ?? "new") as LeadStatus,
    adminNote: String(data.adminNote ?? ""),
    createdAtMs: Number(data.createdAtMs ?? 0),
    updatedAtMs: Number(data.updatedAtMs ?? 0),
    statusHistory: Array.isArray(data.statusHistory)
      ? (data.statusHistory as LeadStatusHistoryEntry[])
      : [],
  };
}

export async function createLeadRecord(input: CreateLeadInput) {
  const ref = getAdminDb().collection(COLLECTION).doc();
  const now = Date.now();

  const record: StoredLead = {
    ...input,
    source: "contact-form",
    status: "new",
    adminNote: "",
    createdAtMs: now,
    updatedAtMs: now,
    statusHistory: [{ status: "new", atMs: now }],
  };

  await ref.set({
    ...record,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return {
    id: ref.id,
    ...record,
  } satisfies Lead;
}

export async function getLeadRecord(id: string) {
  const snapshot = await getAdminDb().collection(COLLECTION).doc(id).get();

  if (!snapshot.exists) {
    return null;
  }

  return mapLead(snapshot.id, snapshot.data() ?? {});
}

export async function listLeadRecords(options: LeadListOptions = {}) {
  const limit = Math.min(Math.max(options.limit ?? 100, 1), 200);
  const collection = getAdminDb().collection(COLLECTION);

  const snapshot = options.status
    ? await collection.where("status", "==", options.status).get()
    : await collection.orderBy("createdAtMs", "desc").limit(limit).get();

  return snapshot.docs
    .map((document) => mapLead(document.id, document.data()))
    .sort((a, b) => b.createdAtMs - a.createdAtMs)
    .slice(0, limit);
}

export async function updateLeadRecord(id: string, input: UpdateLeadInput) {
  const ref = getAdminDb().collection(COLLECTION).doc(id);

  return getAdminDb().runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);

    if (!snapshot.exists) {
      return null;
    }

    const current = mapLead(snapshot.id, snapshot.data() ?? {});
    const now = Date.now();

    const update: UpdateData<DocumentData> = {
      updatedAtMs: now,
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (input.adminNote !== undefined) {
      update.adminNote = input.adminNote;
    }

    if (input.status !== undefined && input.status !== current.status) {
      update.status = input.status;
      update.statusHistory = FieldValue.arrayUnion({
        status: input.status,
        atMs: now,
      });
    }

    transaction.update(ref, update);

    return {
      ...current,
      ...(input.adminNote !== undefined ? { adminNote: input.adminNote } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      updatedAtMs: now,
      statusHistory:
        input.status !== undefined && input.status !== current.status
          ? [
              ...current.statusHistory,
              { status: input.status, atMs: now },
            ]
          : current.statusHistory,
    } satisfies Lead;
  });
}