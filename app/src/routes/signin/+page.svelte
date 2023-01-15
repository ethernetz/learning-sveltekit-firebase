<script lang="ts">
	import {
		onAuthStateChanged,
		GoogleAuthProvider,
		EmailAuthProvider,
		PhoneAuthProvider
	} from 'firebase/auth';

	import * as firebaseui from 'firebaseui';
	import 'firebaseui/dist/firebaseui.css';

	import { authenticate } from '@services/firebase';
	import { onMount } from 'svelte';

	let loggedIn = false;

	const auth = authenticate();

	onMount(() => {
		// FirebaseUI config.
		var uiConfig = {
			signInSuccessUrl: '<url-to-redirect-to-on-success>',
			signInOptions: [
				// Leave the lines as is for the providers you want to offer your users.
				GoogleAuthProvider.PROVIDER_ID,
				'apple.com',
				EmailAuthProvider.PROVIDER_ID,
				PhoneAuthProvider.PROVIDER_ID
			],
			// tosUrl and privacyPolicyUrl accept either url string or a callback
			// function.
			// Terms of service url/callback.
			tosUrl: '<your-tos-url>',
			// Privacy policy url/callback.
			privacyPolicyUrl: function () {
				window.location.assign('<your-privacy-policy-url>');
			}
		};
		console.log(firebaseui.auth);
		// Initialize the FirebaseUI Widget using Firebase.
		var ui = new firebaseui.auth.AuthUI(auth);

		// The start method will wait until the DOM is loaded.
		ui.start('#firebaseui-auth-container', uiConfig);
	});

	onAuthStateChanged(auth, (user) => {
		console.log('onAuthStateChanged!');
		if (user) {
			// User is signed in, see docs for a list of available properties
			// https://firebase.google.com/docs/reference/js/firebase.User
			const uid = user.uid;
			// ...

			loggedIn = true;
		} else {
			// User is signed out
			loggedIn = false;
		}
	});
</script>

<div>Sign in!</div>

{#if loggedIn}
	I am logged in!
{:else}
	<div id="firebaseui-auth-container" />
{/if}
