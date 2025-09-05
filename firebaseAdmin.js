// NOME DO ARQUIVO: firebaseAdmin.js
// Inicializa o Firebase Admin SDK para operações seguras no backend.

import admin from 'firebase-admin';

// Verifica se a aplicação já foi inicializada para evitar erros
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY))
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export default admin;
