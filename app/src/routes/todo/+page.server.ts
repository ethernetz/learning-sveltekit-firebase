import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

// In a real app, this data would live in a database,
// rather than in memory. But for now, we cheat.
const db = new Map<string, { id: string, description: string, done: boolean }[]>();

export function getTodos(userid: string) {
    return db.get(userid) ?? [];
}

export function createTodo(userid: string, description: string) {
    if (!db.has(userid)) {
        db.set(userid, []);
    }

    const todos = db.get(userid) ?? [];

    todos.push({
        id: crypto.randomUUID(),
        description,
        done: false
    });
}

export function deleteTodo(userid: string, todoid: string) {
    const todos = db.get(userid) ?? [];
    const index = todos.findIndex((todo) => todo.id === todoid);

    if (index !== -1) {
        todos.splice(index, 1);
    }
}

export const actions: Actions = {
    create: async ({ cookies, request }) => {
        await new Promise((fulfil) => setTimeout(fulfil, 1000));
        const data = await request.formData();
        const userid = cookies.get('userid');
        if (!userid)
            throw error(404);

        const description = data.get('description');
        if (!description)
            throw error(401, 'todo must have a description');

        createTodo(userid, description.toString());
    },
    delete: async ({ cookies, request }) => {
        await new Promise((fulfil) => setTimeout(fulfil, 1000));
        const data = await request.formData();
        const userid = cookies.get('userid');
        if (!userid)
            throw error(404);

        const todoid = data.get('id');
        if (!todoid)
            return;

        deleteTodo(userid, todoid.toString());
    }
};


export const load: PageServerLoad = ({ cookies }) => {
    let id = cookies.get('userid');

    if (!id) {
        id = crypto.randomUUID();
        cookies.set('userid', id, { path: '/' });
    }

    return {
        todos: getTodos(id)
    };
}