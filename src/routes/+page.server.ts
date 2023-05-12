import { db } from "$lib/server/database";
import { get_session } from "$lib/utils/auth";

export async function load({ cookies }: { cookies: any }) {
  let user = get_session(cookies);

  let cases = user.is_admin
    ? await db.query(
        "SELECT case_id, is_open, type, created, users.name as assignee FROM cases JOIN users ON cases.assignee = users.user_id"
      )
    : await db.query(
        "SELECT case_id, is_open, type, created, users.name as assignee FROM cases JOIN users ON cases.assignee = users.user_id WHERE assignee = $1",
        [user.user_id]
      );

  return {
    cases: cases.rows,
  };
}
