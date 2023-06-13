import { json, error } from "@sveltejs/kit";
import { db, get_user, is_admin } from "$lib/server/database";
import { random_string } from "$lib/utils/misc";
import bcrypt from "bcrypt";

// new account
export async function POST({
  request,
  cookies,
}: {
  request: any;
  cookies: any;
}) {
  const session_id = cookies.get("session");

  if (!(await is_admin(session_id))) {
    throw error(403, "cannot modify user accounts");
  }

  let { name, email, admin } = await request.json();

  let res = await db.query(
    "INSERT INTO users (name, email, is_admin) VALUES ($1, $2, $3) RETURNING user_id",
    [name, email, admin]
  );

  return json(res.rows[0].user_id);
}

// sets a user's account details
export async function PUT({
  request,
  cookies,
}: {
  request: any;
  cookies: any;
}) {
  const session_id = cookies.get("session");

  if (!(await is_admin(session_id))) {
    throw error(403, "cannot modify user accounts");
  }

  let data = await request.json();
  let { user_id, name, email, admin } = data;

  await db.query(
    "UPDATE users SET name = $1, email = $2, is_admin = $3 WHERE user_id = $4",
    [name, email, admin, user_id]
  );

  return json(true);
}

// reset/change password
export async function PATCH({
  request,
  cookies,
}: {
  request: any;
  cookies: any;
}) {
  const session_id = cookies.get("session");

  let data = await request.json();
  let { user_id, password } = data;

  if (user_id) {
    if (!(await is_admin(session_id))) {
      throw error(403, "cannot modify user accounts");
    }
  } else {
    user_id = (await get_user(session_id)).user_id;

    let res = await db.query("SELECT password FROM users WHERE user_id = $1", [
      user_id,
    ]);

    if (!(await bcrypt.compare(data.old_password, res.rows[0]["password"]))) {
      throw error(403, "incorrect password");
    }
  }

  password ??= random_string(8);

  let res = await db.query(
    "UPDATE users SET password = $1 WHERE user_id = $2 RETURNING email",
    [await bcrypt.hash(password, await bcrypt.genSalt(10)), user_id]
  );

  if (res.rowCount === 0) {
    throw error(404);
  }

  await db.query("DELETE FROM sessions WHERE user_id = $1", [user_id]);

  return json({
    password: password,
    email: res.rows[0]["email"],
  });
}

// delete account
export async function DELETE({
  request,
  cookies,
}: {
  request: any;
  cookies: any;
}) {
  const session_id = cookies.get("session");

  if (!(await is_admin(session_id))) {
    throw error(403, "cannot modify user accounts");
  }

  let { user_id } = await request.json();

  if (user_id === 1) {
    throw error(409, "cannot delete the main site admin");
  }

  await db.query("UPDATE cases set assignee = NULL WHERE assignee = $1", [
    user_id,
  ]);
  await db.query("DELETE FROM users WHERE user_id = $1", [user_id]);

  return json(true);
}
