import admin from 'firebase-admin';

var serviceAccount = JSON.parse(process.env.FIREBASEKEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://uvalib-api-occupancy.firebaseio.com',
});

const app = admin.app();

export { admin, app };
