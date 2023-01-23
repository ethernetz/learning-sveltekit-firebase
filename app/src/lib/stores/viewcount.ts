import type { Firestore } from 'firebase/firestore';
import { derived, type Readable } from 'svelte/store';
import { ensureStoreValue, firestore } from '$lib/stores';

const createViewcount = () => {
	const { subscribe } = derived<Readable<Firestore>, number>(firestore, ($firestore, set) => {
		async function init() {
			/** Firestore is not ready yet */
			if (!$firestore) return;

			const viewcountDocRef = await firestore.viewcount($firestore);
			const { getDoc } = await import('firebase/firestore');
			const viewcountDocSnap = await getDoc(viewcountDocRef);
			set(viewcountDocSnap.data()?.viewcount ?? 3);
		}

		init();
	});

	return {
		subscribe,
		increment: async () => {
			const $firestore = await ensureStoreValue(firestore);
			const { increment, runTransaction } = await import('firebase/firestore');
			await runTransaction($firestore, async (transaction) => {
				const viewcountDocRef = await firestore.viewcount($firestore);
				transaction.update(viewcountDocRef, { viewcount: increment(1) });
			});
		}
	};
};

export const viewcount = createViewcount();
