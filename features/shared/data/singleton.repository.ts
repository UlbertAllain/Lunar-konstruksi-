import { FieldValue } from "firebase-admin/firestore";

import { getAdminDb } from "@/lib/firebase/admin";
import { serializeDocument } from "@/lib/firestore";

export async function getSingletonDocument<T>(
  collection: string,
  documentId: string,
) {
  const snapshot = await getAdminDb().collection(collection).doc(documentId).get();

  if (!snapshot.exists) {
    return null;
  }

  return serializeDocument<T>(snapshot.id, snapshot.data());
}

export async function setSingletonDocument<T extends object>(
  collection: string,
  documentId: string,
  data: T,
) {
  const ref = getAdminDb().collection(collection).doc(documentId);
  const current = await ref.get();
  const now = FieldValue.serverTimestamp();
  const createdAt = current.exists ? current.get("createdAt") ?? now : now;

  await ref.set({
    ...data,
    createdAt,
    updatedAt: now,
  });

  const snapshot = await ref.get();
  return serializeDocument<T & { id: string }>(snapshot.id, snapshot.data());
}
