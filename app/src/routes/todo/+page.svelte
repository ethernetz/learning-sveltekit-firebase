<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;

	let creating = false;
	let deleting: string[] = [];
</script>

<h1>todos</h1>

<form
	method="POST"
	action="?/create"
	use:enhance={() => {
		creating = true;

		return async ({ update }) => {
			await update();
			creating = false;
		};
	}}
>
	<label>
		{creating ? 'saving...' : 'add a todo:'}
		<input disabled={creating} name="description" required />
	</label>
</form>

<ul>
	{#each data.todos as todo (todo.id)}
		{#if !deleting.includes(todo.id)}
			<li class="todo">
				<form
					method="POST"
					action="?/delete"
					use:enhance={() => {
						deleting = [...deleting, todo.id];
						return async ({ update }) => {
							await update();
							deleting = deleting.filter((id) => id !== todo.id);
						};
					}}
				>
					<input type="hidden" name="id" value={todo.id} />
					<button aria-label="Mark as complete">✔</button>
					{todo.description}
				</form>
			</li>
		{/if}
	{/each}
</ul>
