import { env } from '$env/dynamic/public';
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import {
    addDoc,
    collection,
    serverTimestamp,
    connectFirestoreEmulator,
    initializeFirestore,
    CACHE_SIZE_UNLIMITED
} from 'firebase/firestore';

import type { FirebaseApp } from 'firebase/app';

const config = {
    useEmulators: env?.PUBLIC_USE_EMULATORS || false,
    firebase: {
        apiKey: "AIzaSyBvGv1wR21oRh_ygvqPDbNK0bjejz3sxkk",
        authDomain: "sveltekit-firebase-1e60f.firebaseapp.com",
        projectId: "sveltekit-firebase-1e60f",
        storageBucket: "sveltekit-firebase-1e60f.appspot.com",
        messagingSenderId: "322843971419",
        appId: "1:322843971419:web:20df0c58ca44b73e5d547e",
        measurementId: "G-EJWTFJLM86"
    },
};

let app: FirebaseApp;

let initializedFirestore: any = null;

let connectedFirestoreEmulator = false;
let connectedAuthEmulator = false;

// These functions should be called in onMount when used in components
export const authenticate = () => {
    console.log('🔥 Authenticating user');
    const auth = getAuth(app);

    if (config.useEmulators && !connectedAuthEmulator) {
        console.log('👓 Connecting Firebase Auth Emulator');
        connectedAuthEmulator = true;
        connectAuthEmulator(auth, 'http://localhost:9099');
    }

    return auth;
};
export const db = () => {
    if (!initializedFirestore) {
        console.log('🔥 Initializing Firestore');

        initializedFirestore = initializeFirestore(app, {
            cacheSizeBytes: CACHE_SIZE_UNLIMITED
        });
    }

    if (config.useEmulators && !connectedFirestoreEmulator) {
        console.log('👓 Connecting Firestore Emulator');
        connectedFirestoreEmulator = true;
        connectFirestoreEmulator(initializedFirestore, 'localhost', 8090);
    }

    return initializedFirestore;
};

export const initialize = (): FirebaseApp => {
    console.log('🔥 Initializing Firebase SDK');
    console.log(config.firebase);
    app = initializeApp(config.firebase);
    return app;
};

export const addMessage = async (name: string, message: string) => {
    const docRef = await addDoc(collection(db(), 'messages'), {
        name,
        message,
        time: serverTimestamp() // https://firebase.google.com/docs/firestore/manage-data/add-data#server_timestamp
    });
    console.log('Chat message written with ID: ', docRef.id);
    return docRef;
};