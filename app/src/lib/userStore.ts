import { browser } from '$app/environment';
import type { Auth, User } from 'firebase/auth';
import { derived, type Readable } from 'svelte/store';
import { auth } from '$lib/authStore';

function createUser() {
    const { subscribe } = derived<Readable<Auth>, User | null>(
        auth,
        ($auth, set) => {
            let unsubAuth = () => { };

            async function init() {
                if ($auth) {
                    const { onAuthStateChanged } = await import('firebase/auth');
                    unsubAuth = onAuthStateChanged($auth, set);
                }
            }

            if (browser) init();

            return unsubAuth;
        }
    );

    return { subscribe };
}

export const user = createUser();