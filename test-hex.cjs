const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

function hexDump() {
  const key = process.env.FIREBASE_PRIVATE_KEY;
  if (!key) return console.log('KEY NOT FOUND');

  console.log('--- Hex Dump (First 50 chars) ---');
  const buffer = Buffer.from(key.substring(0, 100));
  let hex = '';
  let chars = '';
  for (let i = 0; i < buffer.length; i++) {
    hex += buffer[i].toString(16).padStart(2, '0') + ' ';
    chars += (buffer[i] >= 32 && buffer[i] <= 126) ? String.fromCharCode(buffer[i]) : '.';
  }
  console.log('Hex:  ', hex);
  console.log('Chars:', chars);

  console.log('\n--- Key Info ---');
  console.log('Project ID:', JSON.stringify(process.env.FIREBASE_PROJECT_ID));
  console.log('Client Email:', JSON.stringify(process.env.FIREBASE_CLIENT_EMAIL));
}

hexDump();
