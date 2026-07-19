import { getAdminDb } from "@/lib/firebase/admin";
import { serializeDocument } from "@/lib/firestore";
import type { Admin } from "@/types/admin";

const COLLECTION = "admins";

export async function getAdminByUid(uid: string) {
  const snapshot = await getAdminDb().collection(COLLECTION).doc(uid).get();

  if (!snapshot.exists) {
    return null;
  }

  return serializeDocument<Admin>(snapshot.id, snapshot.data());
}
