import type { Firestore } from "firebase/firestore";
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
                set(viewcountDocSnap.data()?.viewcount ?? 3);
            }

            init();
        }
    );

    return {
        subscribe,
        increment: () => {
            const unsubFirestore = firestore.subscribe(
                async ($firestore) => {
                    if (!$firestore)
                        return;
                    const { increment, runTransaction } = await import('firebase/firestore');
                    await runTransaction($firestore, async (transaction) => {
                        const viewcountDocRef = await firestore.docs.viewcount($firestore);
                        transaction.update(viewcountDocRef, { viewcount: increment(1) });
                    });
                    unsubFirestore();
                }
            );
        }
    };
};

export const viewcount = createViewcount();