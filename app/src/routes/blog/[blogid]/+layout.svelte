<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<slot />

<ul>
	{#each data.summaries as { slug, title }}
		<li><a href="/blog/{slug}">{title}</a></li>
	{/each}
</ul>
