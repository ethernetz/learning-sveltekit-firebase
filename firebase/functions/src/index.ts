import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

export const sayHello = functions.https.onCall((data, context) => {
    return { message: 'Hello from the emulator' };
});

// Firebase function 
export const createAccountDocument = functions.auth.user().onCreate((user) => {
    // get user data from the auth trigger
    const userUid = user.uid; // The UID of the user.
    //const email = user.email; // The email of the user.
    //const displayName = user.displayName; // The display name of the user.

    // set account  doc  
    const account = {
        useruid: userUid,
        calendarEvents: []
    };
    functions.logger.info("Hello logs from auth!", { structuredData: true });
    // write new doc to collection
    return admin.firestore().collection('accounts').add(account);
});