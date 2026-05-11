// Firebase configuration template – copy to firebase-config.js and fill in real values.
// firebase-config.js is in .gitignore and must NOT be committed.
// Real credentials are stored in 1Password (vault: dev.workspace).
//
// Retrieve via 1Password CLI:
//   op item get "triviaquiz-website Firebase Config" --vault "dev.workspace" --reveal

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey:            "REPLACE_WITH_API_KEY",
  authDomain:        "triviaquiz-website.firebaseapp.com",
  projectId:         "triviaquiz-website",
  storageBucket:     "triviaquiz-website.firebasestorage.app",
  messagingSenderId: "REPLACE_WITH_SENDER_ID",
  appId:             "REPLACE_WITH_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
