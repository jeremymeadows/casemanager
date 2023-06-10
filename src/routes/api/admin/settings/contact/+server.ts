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

  let { method } = await request.json();

  await db.query("INSERT INTO contact (method) VALUES ($1)", [method]);

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

  let { method } = await request.json();

  await db.query(
    "UPDATE cases SET contact_method = NULL WHERE contact_method = $1",
    [method]
  );

  await db.query("DELETE FROM contact WHERE method = $1", [method]);

  return json(true);
}
