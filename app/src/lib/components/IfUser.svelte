<!-- Is signed in  -->
<script lang="ts">
	import { user } from '$lib/stores';
</script>

{#if $user}
	<slot />
{:else}
	<slot name="signed-out" />
{/if}
