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

// Robust initialization for Next.js environment
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
    console.log('🔥 Firebase Admin Initialized Successfully');
  } catch (error) {
    console.error('❌ Firebase Admin Initialization Error:', error);
  }
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
