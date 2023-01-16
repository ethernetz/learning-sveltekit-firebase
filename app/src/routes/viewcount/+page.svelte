<script lang="ts">
	import { viewcount } from '$lib/stores';
</script>

{#if $viewcount}
	{$viewcount}
{:else}
	there is no viewcount...
{/if}
