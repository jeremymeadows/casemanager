import { db } from '$lib/server/database/index.js';

export async function load({ cookies }) {
    const user = db.get_user(cookies.get('session'));

    return {
        user: user.expect(),
    };
}