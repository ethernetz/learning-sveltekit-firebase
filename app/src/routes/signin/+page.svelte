<script lang="ts">
	import { auth, user } from '$lib/stores';
	import IfUser from '$lib/components/IfUser.svelte';
</script>

<IfUser>
	<div>I am signed in!</div>
	<div>Name: {$user?.displayName}</div>
	<button on:click={() => auth.signOut()}>Sign out</button>
	<div slot="signed-out">
		<div>sign in here</div>
		<button on:click={() => auth.signInWith('google')}>Sign in with google</button>
	</div>
</IfUser>
