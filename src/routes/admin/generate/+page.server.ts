import { error } from "@sveltejs/kit";

import { DEMO_MODE } from "$env/static/public";
import { db } from "$lib/server/database";

export async function load({ cookies }: { cookies: any }) {
  if (!DEMO_MODE) {
    throw error(404, "Not Found");
  }

  const session_id = cookies.get("session");
  const user = db.get_user(session_id);

  if (!user.ok || !user.value.is_admin) {
    throw error(403, "cannot access admin settings");
  }

  return {
    users: db.get_users().expect(),
  };
}
