<script lang="ts">
	import { functions } from '$lib/stores';
</script>

{#if true}
	<button on:click={() => functions.sayHello()}>Hello hello</button>
{/if}
