import { json, error } from "@sveltejs/kit";
import { db } from "$lib/server/database";
import bcrypt from "bcrypt";

export async function POST({
  request,
  cookies,
}: {
  request: any;
  cookies: any;
}) {
  let { email, password } = await request.json();

  let user = await db.query(
    "SELECT user_id, name, password FROM users WHERE email = $1",
    [email]
  );

  if (user.rowCount === 0 || !(await bcrypt.compare(password, user.rows[0]["password"]))) {
    throw error(401, "no account with matching credentials");
  }

  let res = await db.query(
    "INSERT INTO sessions (user_id) VALUES ($1) RETURNING session_id, expires",
    [user.rows[0].user_id]
  );
  let { session_id, expires } = res.rows[0];

  cookies.set("session", session_id, { expires: new Date(expires) });

  return json(res.rows[0]);
}

export async function DELETE({ cookies }: { cookies: any }) {
  const session_id = cookies.get("session");

  await db.query("DELETE FROM sessions WHERE session_id = $1", [session_id]);
  cookies.delete("session");

  return json(true);
}
