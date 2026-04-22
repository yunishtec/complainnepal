const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

function test() {
  console.log('--- Firebase Connection Nuclear Fix Test ---');
  
  let rawKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!rawKey) return console.error('MISSING KEY');

  // Nuclear cleaning logic
  const content = rawKey.split(/\\n|\n|\r/)
    .map(l => l.trim())
    .filter(l => l && !l.includes('---'))
    .join('');
  
  const cleanedBase64 = content.replace(/[^A-Za-z0-9+/=]/g, '');
  const finalKey = `-----BEGIN PRIVATE KEY-----\n${cleanedBase64}\n-----END PRIVATE KEY-----\n`;

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: finalKey,
      }),
    });
    console.log('✅ SUCCESS: Nuclear Fix worked!');
  } catch (error) {
    console.error('❌ FAILURE:', error.message);
  }
}

test();
