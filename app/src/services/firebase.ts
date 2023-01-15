import { browser } from '$app/environment'
import type { FirebaseApp, FirebaseOptions } from 'firebase/app'
import { readable } from 'svelte/store'

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
    let app: FirebaseApp

    const { subscribe } = readable<FirebaseApp>(undefined, (set) => {
        async function init() {
            if (!app) {
                const { initializeApp } = await import('firebase/app')
                app = initializeApp(options)
            }
            set(app)
        }

        if (browser) init()
    })

    return { subscribe }
}

export const app = createApp()