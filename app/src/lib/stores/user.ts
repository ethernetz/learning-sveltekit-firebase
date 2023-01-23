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

			async function init() {
				if ($auth) {
					const { onAuthStateChanged } = await import('firebase/auth');
					unsubAuth = onAuthStateChanged($auth, async (nextUser) => {
						console.log(nextUser);
						if (!nextUser) {
							set(null);
							return;
						}
						const userRef = await firestore.user($firestore, nextUser.uid);
						const { getDoc } = await import('firebase/firestore');
						const userDocSnap = await getDoc(userRef);
						const userData = userDocSnap.data();
						if (!userData) {
							console.error('No user data?');
							return;
						}
						console.log(userData);
						set(userData);
					});
				}
			}
			init();

			return () => {
				userDataCache = undefined;
				unsubAuth?.();
			};
		}
	);

	return { subscribe };
}

export const user = createUser();
