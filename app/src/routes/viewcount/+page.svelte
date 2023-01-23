<script lang="ts">
	import { viewcount, functions } from '$lib/stores';
	import { onMount } from 'svelte';

	onMount(() => viewcount.increment());
</script>

{#if $viewcount}
	{$viewcount}
{:else}
	there is no viewcount...
{/if}
