import { signInWithEmailAndPassword, signOut } from "firebase/auth";

import { getFirebaseAuth } from "./client";

export async function loginAdmin(email: string, password: string) {
  const result = await signInWithEmailAndPassword(
    getFirebaseAuth(),
    email,
    password,
  );
  const token = await result.user.getIdToken();

  return { user: result.user, token };
}

export async function logoutAdmin() {
  await signOut(getFirebaseAuth());
}

export function getCurrentUser() {
  return getFirebaseAuth().currentUser;
}
