<!-- Is signed in  -->
<script lang="ts">
	import { userData } from '$lib/stores';
</script>

{#if $userData}
	<slot />
{:else}
	<slot name="signed-out" />
{/if}
