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

  let { method } = await request.json();

  db.add_contact_method(method);

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

  let { method } = await request.json();

  db.delete_contact_method(method);

  return json(true);
}
