import type { Functions } from 'firebase/functions';
import type { FirebaseApp } from 'firebase/app';
import { dev } from '$app/environment';
import { derived, type Readable } from 'svelte/store';
import { app, ensureStoreValue } from '$lib/stores';

const createFunctions = () => {
	let functionsCache: Functions;

	const { subscribe } = derived<Readable<FirebaseApp>, Functions>(app, ($app, set) => {
		async function init() {
			/** Firebase app is not ready yet */
			if (!$app) return;
			/** Functions is already created, no reason to initialize */
			if (functionsCache) return;

			const { connectFunctionsEmulator, getFunctions } = await import('firebase/functions');

			functionsCache = getFunctions($app);
			if (dev) {
				connectFunctionsEmulator(getFunctions($app), 'localhost', 5001);
			}
			set(functionsCache);
		}

		init();
	});

	async function sayHello() {
		await ensureStoreValue(functions);
		const { httpsCallable } = await import('firebase/functions');
		const result = await httpsCallable(functionsCache, 'sayHello').call({});
		console.log(result);
	}

	return {
		subscribe,
		sayHello
	};
};

export const functions = createFunctions();
