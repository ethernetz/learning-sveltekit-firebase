import { user } from '@services/userStore';
import { get } from 'svelte/store';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params }) => {
    const u = await get(user);
    await new Promise(res => setTimeout(res, 5000));
}