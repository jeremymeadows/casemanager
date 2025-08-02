import { json, error } from "@sveltejs/kit";
import { db } from "$lib/server/database";

export async function POST({ cookies }: { cookies: any }) {
    await db.generate();
    return json(true);
}