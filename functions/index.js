const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

// exports.helloWorld = functions.https.onCall((data, context) => {
//   console.log("Hello World");
//   return "Hello World";
// });
exports.helloWorld = functions.https.onRequest((req, res) => {
  return res.status(200).json({ result: "Hello World" });
});
