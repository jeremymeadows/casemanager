import { json, error } from "@sveltejs/kit";
import { db } from "$lib/server/database";

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
    throw error(403, "cannot modify app settings");
  }

  let { type } = await request.json();
  db.add_type(type);

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
  const user = db.get_user(session_id);

  if (!user.ok || !user.value.is_admin) {
    throw error(403, "cannot modify app settings");
  }

  let { type, subtype } = await request.json();
  db.add_subtype(type, subtype);

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
  const user = db.get_user(session_id);

  if (!user.ok || !user.value.is_admin) {
    throw error(403, "cannot modify app settings");
  }

  let { type, subtype } = await request.json();
  db.delete_subtype(type, subtype);

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
  const user = db.get_user(session_id);

  if (!user.ok || !user.value.is_admin) {
    throw error(403, "cannot modify app settings");
  }

  let { type } = await request.json();
  db.delete_type(type);

  return json(true);
}
