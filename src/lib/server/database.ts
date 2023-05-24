import { error } from "@sveltejs/kit";
import pg from "pg";

export const db = new pg.Client({
  host: "192.0.0.10",
  user: "root",
  password: "toor",
  database: "dkitsu",
  port: 5432,
});

db.connect().catch(() => {
  error(500, "failed to establish database connection");
});

export async function get_user(
  session_id: string
): Promise<{ user_id: number; email: string; name: string }> {
  let res = await db.query(
    "SELECT user_id, email, name FROM users JOIN sessions USING (user_id) WHERE session_id = $1",
    [session_id]
  );

  return res.rows[0];
}

export async function is_admin(session_id: string): Promise<boolean> {
  let res = await db.query(
    "SELECT is_admin FROM users JOIN sessions USING (user_id) WHERE session_id = $1",
    [session_id]
  );

  return res.rowCount !== 0 && res.rows[0].is_admin;
}
