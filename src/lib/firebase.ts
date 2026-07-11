import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

/**
 * Firebase web config.
 *
 * Paste your Firebase project's web app config below. These values are
 * PUBLIC by design (Firebase web apps ship the config to the browser) —
 * security is enforced via Firebase Auth/Firestore rules and the list of
 * authorized domains in the Firebase console.
 *
 * Steps:
 *   1. Firebase console → Project settings → Your apps → Web app → SDK config.
 *   2. Replace the placeholders below.
 *   3. Authentication → Sign-in method → enable "Phone".
 *   4. Authentication → Settings → Authorized domains → add your Lovable
 *      preview/published domains (e.g. *.lovable.app and your custom domain).
 */
export const firebaseConfig = {
  apiKey: "REPLACE_WITH_API_KEY",
  authDomain: "REPLACE_WITH_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_PROJECT_ID",
  storageBucket: "REPLACE_WITH_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_SENDER_ID",
  appId: "REPLACE_WITH_APP_ID",
};

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (_app) return _app;
  _app = getApps()[0] ?? initializeApp(firebaseConfig);
  return _app;
}

export function getFirebaseAuth(): Auth {
  if (_auth) return _auth;
  _auth = getAuth(getFirebaseApp());
  return _auth;
}

export function isFirebaseConfigured(): boolean {
  return !firebaseConfig.apiKey.startsWith("REPLACE_WITH_");
}
