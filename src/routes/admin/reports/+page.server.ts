import { error } from "@sveltejs/kit";
import { db, is_admin } from "$lib/server/database";

export async function load({ cookies }: { cookies: any }) {
  const session_id = cookies.get("session");

  if (!(await is_admin(session_id))) {
    throw error(403, "cannot access reports");
  }

  let users = await db.query(
    "SELECT user_id, name, email, is_admin FROM users ORDER BY user_id"
  );

  return {
    users: users.rows,
  };
}
