<script lang="ts">
	import { auth } from '$lib/stores';
	import IfUser from '$lib/components/IfUser.svelte';
</script>

<div>This is the login page...</div>

<div>just testing things</div>

<IfUser>
	<div>I am signed in!</div>
	<div slot="signed-out">
		<div>sign in here</div>
		<button on:click={() => auth.signInWith('google')}>Sign in with google</button>
	</div>
</IfUser>
