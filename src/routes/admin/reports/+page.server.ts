import { error } from "@sveltejs/kit";
import { db } from "$lib/server/database";
import { contact } from "$lib/server/database/schema";

export async function load({ cookies }: { cookies: any }) {
  const session_id = cookies.get("session");
  const user = db.get_user(session_id);

  if (!user.ok || !user.value.is_admin) {
    throw error(403, "cannot access reports");
  }

  return {
    cases: (await db.get_cases(session_id)).expect(),
    users: db.get_users().expect(),
    contact_methods: db.get_contact_methods().expect(),
  };
}
