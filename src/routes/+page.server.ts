import { db } from "$lib/server/database";
import { get_session } from "$lib/utils/auth";
import { error } from "@sveltejs/kit";

export async function load({ cookies }: { cookies: any }) {
  const session_id = get_session(cookies);
  let cases = await db.get_cases(session_id);

  if (!cases.ok) {
    error(500, cases.error);
  }

  return {
    // cases: cases.rows,
    cases: cases.expect(),
    types: db.get_case_types().expect(),
    users: db.get_users().expect(),
  };
}
