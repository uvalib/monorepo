const admin = require('firebase-admin');
const serviceAccount = require('/Users/dhc4z/Downloads/uvalib-api-firebase-adminsdk-j6vj7-29bb9378a2.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://uvalib-api.firebaseio.com'
});

const db = admin.database();
const NODE_LIMIT = 20;

async function getSchema(ref, path = '/', schema = {}) {
  let snapshot = await ref.limitToFirst(NODE_LIMIT).once('value');
  let data = snapshot.val();

  if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data)) {
      schema[path] = Object.keys(data[0]);
    } else {
      schema[path] = Object.keys(data).slice(0, NODE_LIMIT);
      for (const key in data) {
        await getSchema(ref.child(key), path + key + '/', schema);
      }
    }
  }
  return schema;
}

getSchema(db.ref()).then((schema) => {
  console.log(schema);
}).catch((error) => {
  console.error('Error: ', error);
});

