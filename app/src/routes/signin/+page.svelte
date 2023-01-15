<script lang="ts">
	import { GoogleAuthProvider, EmailAuthProvider, PhoneAuthProvider } from 'firebase/auth';

	import * as firebaseui from 'firebaseui';
	import 'firebaseui/dist/firebaseui.css';

	import { onMount } from 'svelte';

	import { auth } from '@services/authStore';
	import { user } from '@services/userStore';

	// onMount(() => {
	// 	// FirebaseUI config.
	// 	var uiConfig = {
	// 		signInSuccessUrl: '<url-to-redirect-to-on-success>',
	// 		signInOptions: [
	// 			// Leave the lines as is for the providers you want to offer your users.
	// 			GoogleAuthProvider.PROVIDER_ID,
	// 			'apple.com',
	// 			EmailAuthProvider.PROVIDER_ID,
	// 			PhoneAuthProvider.PROVIDER_ID
	// 		],
	// 		// tosUrl and privacyPolicyUrl accept either url string or a callback
	// 		// function.
	// 		// Terms of service url/callback.
	// 		tosUrl: '<your-tos-url>',
	// 		// Privacy policy url/callback.
	// 		privacyPolicyUrl: function () {
	// 			window.location.assign('<your-privacy-policy-url>');
	// 		}
	// 	};
	// 	console.log(firebaseui.auth);
	// 	// Initialize the FirebaseUI Widget using Firebase.
	// 	var ui = new firebaseui.auth.AuthUI($auth);

	// 	// The start method will wait until the DOM is loaded.
	// 	ui.start('#firebaseui-auth-container', uiConfig);
	// });
</script>

<div>Sign in!</div>

{#if $user === undefined}
	<div>Nothing yet</div>
{:else if $user}
	<div>I am signed in!</div>
{:else}
	<!-- <div id="firebaseui-auth-container" /> -->
	<div>sign in</div>
{/if}
