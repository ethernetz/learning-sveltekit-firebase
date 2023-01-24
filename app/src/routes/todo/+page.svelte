<script lang="ts">
	let todoInput = '';
	import { todos } from '$lib/stores';
</script>

<h1>todos</h1>

<form
	on:submit|preventDefault={() => {
		todos.addTodo(todoInput);
		todoInput = '';
	}}
>
	<label>
		<input
			name="description"
			bind:value={todoInput}
			type="text"
			placeholder="new todo item.."
			required
		/>
	</label>
</form>

{#if $todos}
	<ul>
		{#each $todos as todo}
			<li class="todo">
				<form on:submit|preventDefault={() => todos.deleteTodo(todo.id)}>
					<input type="hidden" name="id" value={todo.id} />
					<button aria-label="Mark as complete">✔</button>
					{todo.description}
				</form>
			</li>
		{/each}
	</ul>
{/if}
