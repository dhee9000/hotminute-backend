var admin = require("firebase-admin");

var serviceAccount = require("../firebase-service-account.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hot-minute.firebaseio.com"
});

module.exports = admin;