import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const REQUIRED_ENV = [
  "FIREBASE_ADMIN_PROJECT_ID",
  "FIREBASE_ADMIN_CLIENT_EMAIL",
  "FIREBASE_ADMIN_PRIVATE_KEY",
  "ADMIN_EMAIL",
  "ADMIN_NAME",
];

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Environment variable ${name} belum diisi.`);
  return value;
}

function getAdminApp() {
  if (getApps().length) return getApps()[0];

  return initializeApp({
    credential: cert({
      projectId: requireEnv("FIREBASE_ADMIN_PROJECT_ID"),
      clientEmail: requireEnv("FIREBASE_ADMIN_CLIENT_EMAIL"),
      privateKey: requireEnv("FIREBASE_ADMIN_PRIVATE_KEY").replace(/\\n/g, "\n"),
    }),
  });
}

async function resolveUser(auth, email) {
  try {
    return await auth.getUserByEmail(email);
  } catch (error) {
    if (error?.code !== "auth/user-not-found") throw error;

    const password = requireEnv("ADMIN_PASSWORD");
    return auth.createUser({
      email,
      password,
      displayName: requireEnv("ADMIN_NAME"),
      emailVerified: true,
    });
  }
}

async function main() {
  for (const name of REQUIRED_ENV) requireEnv(name);

  const email = requireEnv("ADMIN_EMAIL").toLowerCase();
  const name = requireEnv("ADMIN_NAME");
  const role = (process.env.ADMIN_ROLE ?? "SUPER_ADMIN").trim();

  if (!["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(role)) {
    throw new Error("ADMIN_ROLE harus SUPER_ADMIN, ADMIN, atau EDITOR.");
  }

  const app = getAdminApp();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const user = await resolveUser(auth, email);
  const ref = db.collection("admins").doc(user.uid);
  const existing = await ref.get();

  await ref.set(
    {
      uid: user.uid,
      name,
      email,
      role,
      isActive: true,
      ...(existing.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  console.log(`Admin siap: ${email} (${role})`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
