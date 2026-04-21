import * as admin from 'firebase-admin';

// Handling the private key formatting for environment variables
const privateKey = process.env.FIREBASE_PRIVATE_KEY 
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID?.trim(),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL?.trim(),
  privateKey: privateKey,
};

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
