<script lang="ts">
	import { onMount } from 'svelte';
	import { addMessage, initialize } from '@services/firebase';
	onMount(async () => {
		console.log('Hello!');
		await initialize();
	});
</script>

<nav>
	<a href="/">home</a>
	<a href="/about">about</a>
	<a href="/blog">blog</a>
	<a href="/todo">todo</a>
	<a href="/dice">dice</a>
</nav>

<slot />
