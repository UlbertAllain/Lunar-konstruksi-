export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR";

export interface Admin {
  id?: string;
  uid: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
