import type { Auth, UserInfo } from 'firebase/auth';
import { derived, type Readable } from 'svelte/store';
import { auth, firestore } from '$lib/stores';
import type { Firestore } from 'firebase/firestore';

export interface UserData extends UserInfo {
	todos: string[];
}

function createUser() {
	let userDataCache: UserData | null | undefined;

	const { subscribe } = derived<[Readable<Auth>, Readable<Firestore>], UserData | null>(
		[auth, firestore],
		([$auth, $firestore], set) => {
			/** Firebase auth or firestore is not ready yet */
			if (!$auth || !$firestore) return;
			/** User is already cached, no reason to initialize */
			if (userDataCache !== undefined) return;

			let unsubAuth: () => void;
			let unsubUser: () => void;

			async function init() {
				if ($auth) {
					const { onAuthStateChanged } = await import('firebase/auth');
					unsubAuth = onAuthStateChanged($auth, async (nextUser) => {
						/** User is not signed in yet */
						if (!nextUser) {
							set(null);
							return;
						}
						const userRef = await firestore.user($firestore, nextUser.uid);
						const { onSnapshot } = await import('firebase/firestore');
						unsubUser = onSnapshot(userRef, (userDocSnap) => {
							const userData = userDocSnap.data();
							/** User just created an account but it hasn't been added to firestore yet */
							if (!userData) {
								return;
							}
							set(userData);
						});
					});
				}
			}
			init();

			return () => {
				userDataCache = undefined;
				unsubAuth?.();
				unsubUser?.();
			};
		}
	);

	return { subscribe };
}

export const user = createUser();
