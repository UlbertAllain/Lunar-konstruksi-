import type { QueryDocumentSnapshot } from "firebase-admin/firestore";

import { getAdminDb } from "@/lib/firebase/admin";
import { serializeDocument } from "@/lib/firestore";
import {
  createDocument,
  deleteDocument,
  getDocumentById,
  updateDocument,
} from "@/features/shared/data/base.repository";

import type {
  CmsPage,
  CmsSystemPageKey,
  CreateCmsPageInput
} from "./page.types";

const COLLECTION = "cmsPages";

export async function createCmsPageRecord(data: CreateCmsPageInput) {
  return (await createDocument<CreateCmsPageInput>(COLLECTION, data)) as CmsPage;
}

export async function listCmsPageRecords() {
  const snapshot = await getAdminDb().collection(COLLECTION).orderBy("title").get();

  return snapshot.docs.map((document: QueryDocumentSnapshot) =>
    serializeDocument<CmsPage>(document.id, document.data()),
  );
}

export function getCmsPageRecordById(id: string) {
  return getDocumentById<CmsPage>(COLLECTION, id);
}

export async function getCmsPageRecordBySlug(slug: string) {
  const snapshot = await getAdminDb()
    .collection(COLLECTION)
    .where("slug", "==", slug)
    .limit(1)
    .get();

  const document = snapshot.docs[0];
  return document
    ? serializeDocument<CmsPage>(document.id, document.data())
    : null;
}

export async function getCmsPageRecordBySystemKey(systemKey: CmsSystemPageKey) {
  const snapshot = await getAdminDb()
    .collection(COLLECTION)
    .where("systemKey", "==", systemKey)
    .limit(1)
    .get();

  const document = snapshot.docs[0];
  return document
    ? serializeDocument<CmsPage>(document.id, document.data())
    : null;
}

export function updateCmsPageRecord(id: string, data: CreateCmsPageInput) {
  return updateDocument<CmsPage>(COLLECTION, id, data);
}

export function deleteCmsPageRecord(id: string) {
  return deleteDocument(COLLECTION, id);
}
