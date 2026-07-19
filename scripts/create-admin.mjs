import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} belum diisi.`);
  return value;
}

const app = getApps()[0] ?? initializeApp({
  credential: cert({
    projectId: required("FIREBASE_ADMIN_PROJECT_ID"),
    clientEmail: required("FIREBASE_ADMIN_CLIENT_EMAIL"),
    privateKey: required("FIREBASE_ADMIN_PRIVATE_KEY").replace(/\\n/g, "\n"),
  }),
});

const email = required("ADMIN_EMAIL");
const password = required("ADMIN_PASSWORD");
const name = process.env.ADMIN_NAME || "Administrator";
const role = process.env.ADMIN_ROLE || "SUPER_ADMIN";
const auth = getAuth(app);
const db = getFirestore(app);

let user;
try {
  user = await auth.getUserByEmail(email);
  await auth.updateUser(user.uid, { password, displayName: name, disabled: false });
  console.log(`Firebase Auth user diperbarui: ${email}`);
} catch (error) {
  if (error?.code !== "auth/user-not-found") throw error;
  user = await auth.createUser({ email, password, displayName: name, emailVerified: true });
  console.log(`Firebase Auth user dibuat: ${email}`);
}

await db.collection("admins").doc(user.uid).set(
  {
    uid: user.uid,
    name,
    email,
    role,
    isActive: true,
    updatedAt: FieldValue.serverTimestamp(),
    createdAt: FieldValue.serverTimestamp(),
  },
  { merge: true },
);

console.log(`Dokumen admins/${user.uid} siap dengan role ${role}.`);
