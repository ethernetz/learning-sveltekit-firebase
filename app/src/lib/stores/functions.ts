import type { Functions, } from "firebase/functions";
import type { FirebaseApp } from 'firebase/app';
import { dev } from '$app/environment';
import { derived, type Readable } from 'svelte/store';
import { app } from '$lib/stores';

const createFunctions = () => {
    let functions: Functions;

    const { subscribe } = derived<Readable<FirebaseApp>, Functions>(
        app,
        ($app, set) => {
            async function init() {
                /** Firebase app is not ready yet */
                if (!$app)
                    return;
                /** Functions is already created, no reason to initialize */
                if (functions)
                    return;

                const { connectFunctionsEmulator, getFunctions } = await import('firebase/functions');

                functions = getFunctions($app);
                if (dev) {
                    connectFunctionsEmulator(getFunctions($app), 'localhost', 5001);
                }
                set(functions);
            }

            init();
        }
    );

    async function sayHello() {
        const { httpsCallable } = await import('firebase/functions');
        const result = await httpsCallable(functions, 'sayHello').call({});
        console.log(result);
    }

    return {
        subscribe,
        sayHello,
    };
};

export const functions = createFunctions();