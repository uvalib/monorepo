import admin from 'firebase-admin';

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://uvalib-api-occupancy.firebaseio.com',
});

const app = admin.app();

export {admin, app}