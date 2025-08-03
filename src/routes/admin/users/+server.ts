import { json, error } from "@sveltejs/kit";
import { db } from "$lib/server/database";
import { random_string } from "$lib/utils/misc";

// new account
export async function POST({
  request,
  cookies,
}: {
  request: any;
  cookies: any;
}) {
  const session_id = cookies.get("session");
  const user = db.get_user(session_id);

  if (!user.ok || !user.value.is_admin) {
    throw error(403, "cannot modify user accounts");
  }

  let { name, email, admin } = await request.json();

  let id = db.add_user(name, email, admin);

  return json(id);
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
  const user = db.get_user(session_id);

  if (!user.ok || !user.value.is_admin) {
    throw error(403, "cannot modify user accounts");
  }

  let data = await request.json();
  let { user_id, name, email, admin } = data;

  db.update_user(user_id, name, email, admin);

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
  const user = db.get_user(session_id);

  let data = await request.json();
  let { user_id, password } = data;

  if (user_id) {
    if (!user.ok || !user.value.is_admin) {
      throw error(403, "cannot modify user accounts");
    }
  } else {
    user_id = user.value.id;

    let res = await db.query("SELECT password FROM users WHERE user_id = $1", [
      user_id,
    ]);

    if (!(await Bun.password.verify(data.old_password, res.rows[0]["password"]))) {
      throw error(403, "incorrect password");
    }
  }

  password ??= random_string(8);

  let res = await db.query(
    "UPDATE users SET password = $1 WHERE user_id = $2 RETURNING email",
    [await Bun.password.hash(password), user_id]
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
  const user = db.get_user(session_id);

  if (!user.ok || !user.value.is_admin) {
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
