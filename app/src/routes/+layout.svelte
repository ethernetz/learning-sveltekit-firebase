<script lang="ts">
	import type { LayoutData } from './$types';
	import { initialize } from '@services/firebase';

	initialize();
</script>

<nav>
	<a href="/">home</a>
	<a href="/about">about</a>
	<a href="/blog">blog</a>
	<a href="/todo">todo</a>
	<a href="/dice">dice</a>
	<a href="/signin">signin</a>
</nav>

<slot />
