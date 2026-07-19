import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let firestore: Firestore | null = null;

export function hasFirebaseClientConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  );
}

function requiredPublicEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Environment variable ${name} belum diisi.`);
  }
  return value;
}

export function getFirebaseApp() {
  if (firebaseApp) return firebaseApp;

  firebaseApp =
    getApps()[0] ??
    initializeApp({
      apiKey: requiredPublicEnv(
        "NEXT_PUBLIC_FIREBASE_API_KEY",
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      ),
      authDomain: requiredPublicEnv(
        "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      ),
      projectId: requiredPublicEnv(
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      ),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: requiredPublicEnv(
        "NEXT_PUBLIC_FIREBASE_APP_ID",
        process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      ),
    });

  return firebaseApp;
}

export function getFirebaseAuth() {
  firebaseAuth ??= getAuth(getFirebaseApp());
  return firebaseAuth;
}

export function getFirebaseDb() {
  firestore ??= getFirestore(getFirebaseApp());
  return firestore;
}
