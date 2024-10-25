
const admin = require('firebase-admin');

admin.initializeApp({
	credential: admin.credential.cert('./configs/serviceAccountKey.json'),
	storageBucket: 'gs://testupload-c1261.appspot.com'
});

const storage = admin.storage();
const bucket = storage.bucket();

module.exports = { bucket };