import { json, error } from "@sveltejs/kit";
import { db, is_admin } from "$lib/server/database";

export async function POST({
  request,
  cookies,
}: {
  request: any;
  cookies: any;
}) {
  const session_id = cookies.get("session");

  if (!(await is_admin(session_id))) {
    throw error(403, "cannot modify app settings");
  }

  let { type } = await request.json();

  await db.query(
    "INSERT INTO types (name) VALUES ($1)",
    [type]
  );

  return json(true);
}

export async function PUT({
  request,
  cookies,
}: {
  request: any;
  cookies: any;
}) {
  const session_id = cookies.get("session");

  if (!(await is_admin(session_id))) {
    throw error(403, "cannot modify app settings");
  }

  let { type, subtype } = await request.json();

  await db.query(
    "INSERT INTO subtypes (parent, name) VALUES ($1, $2)",
    [type, subtype]
  );

  return json(true);
}

export async function PATCH({
  request,
  cookies,
}: {
  request: any;
  cookies: any;
}) {
  const session_id = cookies.get("session");

  if (!(await is_admin(session_id))) {
    throw error(403, "cannot modify app settings");
  }

  let { type, subtype } = await request.json();

  await db.query(
    "DELETE FROM subtypes WHERE parent = $1 AND name = $2",
    [type, subtype]
  );

  return json(true);
}

export async function DELETE({
  request,
  cookies,
}: {
  request: any;
  cookies: any;
}) {
  const session_id = cookies.get("session");

  if (!(await is_admin(session_id))) {
    throw error(403, "cannot modify app settings");
  }

  let { type } = await request.json();
  console.log(type)

  await db.query(
    "DELETE FROM types WHERE name = $1",
    [type]
  );

  return json(true);
}

