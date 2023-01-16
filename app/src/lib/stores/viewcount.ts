import type { Firestore } from "firebase/firestore";
import { dev } from '$app/environment';
import { derived, type Readable } from 'svelte/store';
import { firestore } from '$lib/stores';

const createViewcount = () => {

    const { subscribe } = derived<Readable<Firestore>, number>(
        firestore,
        ($firestore, set) => {
            async function init() {
                /** Firestore is not ready yet */
                if (!$firestore)
                    return;

                const viewcountDocRef = await firestore.docs.viewcount($firestore);
                const { getDoc } = await import('firebase/firestore');
                const viewcountDocSnap = await getDoc(viewcountDocRef);
                set(viewcountDocSnap.data()?.viewcount ?? 0);
            }

            init();
        }
    );

    return { subscribe };
};

export const viewcount = createViewcount();