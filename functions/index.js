const functions = require('firebase-functions');
const admin  = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

exports.deleteUser = functions.https.onCall((data, context) => {
    admin.auth().deleteUser(data.uid)
    .then(() => {
        return console.log('Successfully deleted user: ', data.uid);
    })
    .catch((error) => {
        return console.log('Error deleting user:', error);
    })
})

exports.updateEmail = functions.https.onCall((data, context) => {
    admin.auth().updateUser(data.uid, {
    email: data.email,
  })
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      return console.log('Successfully updated user', userRecord.toJSON());
    })
    .catch((error) => {
      return console.log('Error updating user:', error);
    });
})
