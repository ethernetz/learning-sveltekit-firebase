import type { FirebaseApp, FirebaseOptions } from 'firebase/app';
import { readable } from 'svelte/store';
import { browser } from '$app/environment';

const options: FirebaseOptions = {
    apiKey: "AIzaSyBvGv1wR21oRh_ygvqPDbNK0bjejz3sxkk",
    authDomain: "sveltekit-firebase-1e60f.firebaseapp.com",
    projectId: "sveltekit-firebase-1e60f",
    storageBucket: "sveltekit-firebase-1e60f.appspot.com",
    messagingSenderId: "322843971419",
    appId: "1:322843971419:web:20df0c58ca44b73e5d547e",
    measurementId: "G-EJWTFJLM86"
};


/** Only initalize the app on-demand so no firebase JS will be used until needed 🔥
 *  Other services like authStore & userStore will derive from this */
function createApp() {
    let app: FirebaseApp;

    const { subscribe } = readable<FirebaseApp>(undefined, (set) => {
        async function init() {
            /** Only use firebase sdk on client */
            if (!browser)
                return;
            /** App is already created, no reason to initialize */
            if (app)
                return;

            const { initializeApp } = await import('firebase/app');
            app = initializeApp(options);
            set(app);
        }

        init();
    });

    return { subscribe };
}

export const app = createApp();