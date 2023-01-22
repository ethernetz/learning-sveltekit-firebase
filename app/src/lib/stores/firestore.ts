import type { Firestore } from 'firebase/firestore';
import type { FirebaseApp } from 'firebase/app';
import { dev } from '$app/environment';
import { derived, get, type Readable } from 'svelte/store';
import { app, user } from '$lib/stores';

const typedCollection = async <T>(
	firestore: Firestore,
	path: string,
	...pathSegments: string[]
) => {
	const { collection } = await import('firebase/firestore');
	return collection(firestore, path, ...pathSegments).withConverter({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		toFirestore: (data) => data as any,
		fromFirestore: (snap) => snap.data() as T
	});
};

const typedDoc = async <T>(firestore: Firestore, path: string, ...pathSegments: string[]) => {
	const { doc } = await import('firebase/firestore');
	return doc(firestore, path, ...pathSegments).withConverter({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		toFirestore: (data) => data as any,
		fromFirestore: (snap) => snap.data() as T
	});
};

const createFirestore = () => {
	let firestoreCache: Firestore;

	const { subscribe } = derived<Readable<FirebaseApp>, Firestore>(app, ($app, set) => {
		async function init() {
			/** Firebase app is not ready yet */
			if (!$app) return;
			/** Firestore is already created, no reason to initialize */
			if (firestoreCache) return;

			const { getFirestore, connectFirestoreEmulator } = await import('firebase/firestore');
			firestoreCache = getFirestore($app);
			if (dev) {
				connectFirestoreEmulator(firestoreCache, 'localhost', 8080);
			}
			set(firestoreCache);
		}

		init();
	});

	return {
		subscribe,
		collections: {
			viewcountcollection: () => {
				const $firestore = get(firestore);
				return typedCollection<{ viewcount: number }>($firestore, 'viewcountcollectionid');
			}
		},
		docs: {
			viewcount: () => {
				const $firestore = get(firestore);
				return typedDoc<{ viewcount: number }>(
					$firestore,
					'viewcountcollectionid',
					'viewcountdocid'
				);
			},
			user: () => {
				const $user = get(user);
				const $firestore = get(firestore);
				if (!$user) {
					console.log('no user :(');
					return;
				}

				return typedDoc<{ viewcount: number }>($firestore, 'users', $user.uid);
			}
		}
	};
};

export const firestore = createFirestore();
