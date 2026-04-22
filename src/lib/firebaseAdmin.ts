import * as admin from 'firebase-admin';

// This function safely initializes and returns the Firebase Admin instance
function getAdminApp() {
  if (!admin.apps.length) {
    let rawKey = process.env.FIREBASE_PRIVATE_KEY;
    let finalKey = '';
    
    if (rawKey) {
      console.log('⚡ Running Nuclear PEM Fix...');
      
      // 1. Strip all newlines and spaces to get the raw content
      const content = rawKey.split(/\\n|\n|\r/)
        .map(l => l.trim())
        .filter(l => l && !l.includes('---'))
        .join('');
      
      // 2. Clean EVERYTHING except valid base64 characters
      const cleanedBase64 = content.replace(/[^A-Za-z0-9+/=]/g, '');
      
      // 3. Rebuild with rigid PEM structure
      finalKey = `-----BEGIN PRIVATE KEY-----\n${cleanedBase64}\n-----END PRIVATE KEY-----\n`;
    }

    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID?.trim(),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL?.trim(),
      privateKey: finalKey,
    };

    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      });
      console.log('✅ Firebase Admin Initialized (Nuclear Fix)');
    } catch (error: any) {
      console.error('❌ Firebase Admin Init Error:', error.message);
    }
  }
  return admin.apps[0];
}

export const getDb = () => {
  const app = getAdminApp();
  if (!app) return null;
  return admin.firestore();
};

export const getAuth = () => {
  const app = getAdminApp();
  if (!app) return null;
  return admin.auth();
};
