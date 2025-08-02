import { db } from "$lib/server/database";
import { get_session } from "$lib/utils/auth";

export async function load({ cookies }: { cookies: any }) {
  let session_id = get_session(cookies);
  let cases = await db.get_cases(session_id);

  // let pins = await db.query("SELECT case_id FROM pins WHERE user_id = (SELECT user_id FROM sessions WHERE session_id = $1)", [session_id]);

  return {
    cases: cases.expect(),
    user: db.get_user(session_id).value,
    types: db.get_case_types().expect(),
    users: db.get_users().expect(),
    // pins: pins.rows.map((e) => e.case_id),
  };
}
