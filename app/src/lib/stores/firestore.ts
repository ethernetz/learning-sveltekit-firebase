import type { Firestore } from "firebase/firestore";
import type { FirebaseApp } from 'firebase/app';
import { dev } from '$app/environment';
import { derived, type Readable } from 'svelte/store';
import { app } from '$lib/stores';

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

    return { subscribe };
};

export const firestore = createFirestore();