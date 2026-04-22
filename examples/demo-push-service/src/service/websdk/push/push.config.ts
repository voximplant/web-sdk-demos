import type { FirebaseOptions } from "firebase/app";

/**
 * The Firebase Cloud Messaging configuration. Obtain in the firebase console (https://console.firebase.google.com/)
 */
export const firebaseConfig: FirebaseOptions = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

/**
 * The bundle id of push token, registered in the Voximplant Manage
 */
export const voximplantBundleId = import.meta.env.VITE_VOXIMPLANT_BUNDLE_ID;
