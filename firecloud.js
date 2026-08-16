/* ================================================================
   Firecloud — shared Firebase init + anonymous identity for every
   gonzogonzo.com property (arcade, music, blog, wanderer).

   Include on any page with:
     <script type="module" src="/firecloud.js"></script>

   Then, anywhere you need it:
     const { db, uid } = await window.firecloud.ready;
     // db  = Firestore instance
     // uid = this visitor's stable anonymous ID (same across all
     //       four properties, because they share one origin)
   ================================================================ */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

/* TODO — paste your real config here.
   Firebase console → Project settings (gear icon) → General →
   Your apps → SDK setup and configuration → Config.
   Use the SAME project the arcade leaderboard already lives in. */
const firebaseConfig = {
  apiKey: "PASTE_YOURS",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_YOURS",
  appId: "PASTE_YOURS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* Resolves once the visitor has an anonymous identity.
   Firebase persists the anonymous user in this browser, so the
   same visitor keeps the same uid across visits and properties. */
const ready = new Promise((resolve, reject) => {
  onAuthStateChanged(auth, user => {
    if (user) resolve({ app, auth, db, uid: user.uid });
  });
  signInAnonymously(auth).catch(reject);
});

window.firecloud = { app, auth, db, ready };
export { app, auth, db, ready };
