import { json, error } from "@sveltejs/kit";
import { db, is_admin } from "$lib/server/database";
import bcrypt from "bcrypt";

// sets a user's account details
export async function PUT({
  request,
  cookies,
}: {
  request: any;
  cookies: any;
}) {
  const session_id = cookies.get("session");

  let data = await request.json();
  let { user_id, name, email, admin } = data;

  if (!(await is_admin(session_id))) {
    throw error(403, "cannot modify user accounts");
  }

  await db.query(
    "UPDATE users SET name = $1, email = $2, is_admin = $3 WHERE user_id = $4",
    [name, email, admin, user_id]
  );

  return json(true);
}

// reset password
export async function PATCH({
  request,
  cookies,
}: {
  request: any;
  cookies: any;
}) {
  const session_id = cookies.get("session");

  let data = await request.json();
  let { user_id } = data;

  if (!(await is_admin(session_id))) {
    throw error(403, "cannot modify user accounts");
  }

  let password = Array(10)
    .fill(null)
    .map((_) =>
      ((Math.random() * 36) | 0)
        .toString(36)
        [Math.random() < 0.5 ? "toString" : "toUpperCase"]()
    )
    .join("");

  let res = await db.query("UPDATE users SET password = $1 WHERE user_id = $2 RETURNING email", [
    await bcrypt.hash(password, await bcrypt.genSalt(10)),
    user_id,
  ]);

  if (res.rowCount === 0) {
    throw error(404);
  }

  return json({
    password: password,
    email: res.rows[0]["email"],
  });
}

// new account
export async function POST({
  request,
  cookies,
}: {
  request: any;
  cookies: any;
}) {
  const session_id = cookies.get("session");

  let { name, email, admin } = await request.json();

  if (!(await is_admin(session_id))) {
    throw error(403, "cannot modify user accounts");
  }

  let res = await db.query(
    "INSERT INTO USERS (name, email, is_admin) VALUES ($1, $2, $3) RETURNING user_id",
    [name, email, admin]
  );

  return json(res.rows[0].user_id);
}
