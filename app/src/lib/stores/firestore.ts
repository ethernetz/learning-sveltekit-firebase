import type { Firestore, FirestoreDataConverter, QueryDocumentSnapshot } from "firebase/firestore";
import type { FirebaseApp } from 'firebase/app';
import { dev } from '$app/environment';
import { derived, type Readable } from 'svelte/store';
import { app } from '$lib/stores';


const typedCollection = async <T>(firestore: Firestore, path: string, ...pathSegments: string[]) => {
    const { collection } = await import('firebase/firestore');
    return collection(firestore, path, ...pathSegments).withConverter({
        toFirestore: (data) => data as any,
        fromFirestore: (snap) => snap.data() as T
    });
};

const typedDoc = async <T>(firestore: Firestore, path: string, ...pathSegments: string[]) => {
    const { doc } = await import('firebase/firestore');
    return doc(firestore, path, ...pathSegments).withConverter({
        toFirestore: (data) => data as any,
        fromFirestore: (snap) => snap.data() as T
    });
};


const createFirestore = () => {
    let firestore: Firestore;

    const { subscribe } = derived<Readable<FirebaseApp>, Firestore>(
        app,
        ($app, set) => {
            async function init() {
                /** Firebase app is not ready yet */
                if (!$app)
                    return;
                /** Firestore is already created, no reason to initialize */
                if (firestore)
                    return;

                const { getFirestore, connectFirestoreEmulator } = await import('firebase/firestore');
                firestore = getFirestore($app);
                if (dev) {
                    connectFirestoreEmulator(firestore, 'localhost', 8080);
                }
                set(firestore);
            }

            init();
        }
    );

    return {
        subscribe,
        collections: {
            viewcountcollection: (firestore: Firestore) => typedCollection<{ viewcount: number; }>(firestore, 'viewcountcollectionid'),
        },
        docs: {
            viewcount: (firestore: Firestore) => typedDoc<{ viewcount: number; }>(firestore, 'viewcountcollectionid', 'viewcountdocid'),
        }
    };
};

export const firestore = createFirestore();