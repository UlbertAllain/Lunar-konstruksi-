import { getAdminAuth } from "@/lib/firebase/admin-auth";
import { getAdminByUid } from "@/repositories/admin.repository";
import type { Admin } from "@/types/admin";

export async function verifyAdmin(token: string): Promise<Admin> {
  const decoded = await getAdminAuth().verifyIdToken(token);
  const admin = await getAdminByUid(decoded.uid);

  if (!admin) {
    throw new Error("Akun ini belum terdaftar sebagai admin.");
  }

  if (!admin.isActive) {
    throw new Error("Akun admin tidak aktif.");
  }

  return admin;
}
