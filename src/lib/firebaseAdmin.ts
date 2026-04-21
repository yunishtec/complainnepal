import * as admin from 'firebase-admin';

// This function safely initializes and returns the Firebase Admin instance
function getAdminApp() {
  if (!admin.apps.length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY 
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID?.trim(),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL?.trim(),
      privateKey: privateKey,
    };

    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      });
      console.log('🔥 Firebase Admin Initialized (Lazy)');
    } catch (error) {
      console.error('❌ Firebase Admin Lazy Init Error:', error);
      // We don't throw here to avoid crashing the Next.js build worker 
      // when it statically analyzes the file.
    }
  }
  return admin.apps[0];
}

// Lazy Getters for database and auth
export const getDb = () => {
  const app = getAdminApp();
  if (!app) return null as any; // Fail-safe for build time
  return admin.firestore();
};

export const getAuth = () => {
  const app = getAdminApp();
  if (!app) return null as any; // Fail-safe for build time
  return admin.auth();
};

// Also export the original constants for backward compatibility where possible,
// but they might still execute at top level. 
// Actually, it's better to remove them to force the new pattern.
