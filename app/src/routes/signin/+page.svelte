<script lang="ts">
	import { user, auth } from '$lib/stores';
</script>

<div>This is the login page...</div>

<div>just testing things</div>

{#if $user === undefined}
	<div>Nothing yet</div>
{:else if $user === null}
	<div>sign in here</div>
	<button on:click={() => auth.signInWith('google')}>Sign in with google</button>
{:else}
	<div>I am signed in!</div>
{/if}
