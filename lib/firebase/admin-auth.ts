import { getAuth } from "firebase-admin/auth";
import { getApps } from "firebase-admin/app";

export function getAdminAuth() {
  const app = getApps()[0];

  if (!app) {
    throw new Error("Firebase Admin belum diinisialisasi.");
  }

  return getAuth(app);
}
