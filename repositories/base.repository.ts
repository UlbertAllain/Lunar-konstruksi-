import { FieldValue } from "firebase-admin/firestore";

import { getAdminDb } from "@/lib/firebase/admin";
import { serializeDocument } from "@/lib/firestore";

export async function createDocument<T extends object>(
  collection: string,
  data: T,
) {
  const ref = getAdminDb().collection(collection).doc();
  const now = FieldValue.serverTimestamp();

  await ref.set({ ...data, createdAt: now, updatedAt: now });

  const snapshot = await ref.get();
  return serializeDocument<T & { id: string }>(snapshot.id, snapshot.data());
}

export async function listDocuments<T>(collection: string) {
  const snapshot = await getAdminDb().collection(collection).get();

  return snapshot.docs.map((document) =>
    serializeDocument<T>(document.id, document.data()),
  );
}

export async function getDocumentById<T>(collection: string, id: string) {
  const snapshot = await getAdminDb().collection(collection).doc(id).get();

  if (!snapshot.exists) {
    return null;
  }

  return serializeDocument<T>(snapshot.id, snapshot.data());
}

export async function updateDocument<T extends object>(
  collection: string,
  id: string,
  data: Partial<T>,
) {
  const ref = getAdminDb().collection(collection).doc(id);

  if (!(await ref.get()).exists) {
    return null;
  }

  await ref.update({ ...data, updatedAt: FieldValue.serverTimestamp() });

  const snapshot = await ref.get();
  return serializeDocument<T>(snapshot.id, snapshot.data());
}

export async function deleteDocument(collection: string, id: string) {
  const ref = getAdminDb().collection(collection).doc(id);
  const snapshot = await ref.get();

  if (!snapshot.exists) {
    return false;
  }

  await ref.delete();
  return true;
}
