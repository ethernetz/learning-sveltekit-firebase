import type { Auth, User } from 'firebase/auth';
import { derived, type Readable } from 'svelte/store';
import { auth } from '$lib/stores';

function createUser() {

    let user: User | null | undefined;

    const { subscribe } = derived<Readable<Auth>, User | null>(
        auth,
        ($auth, set) => {
            /** Firebase app is not ready yet */
            if (!$auth)
                return;
            /** User is already created, no reason to initialize */
            if (user !== undefined)
                return;

            let unsubAuth = () => { };

            async function init() {
                if ($auth) {
                    const { onAuthStateChanged } = await import('firebase/auth');
                    unsubAuth = onAuthStateChanged($auth, (nextUser) => {
                        user = nextUser;
                        set(user);
                    });
                }
            }
            init();

            return () => {
                user = undefined;
                unsubAuth();
            };
        }
    );

    return { subscribe };
}

export const user = createUser();