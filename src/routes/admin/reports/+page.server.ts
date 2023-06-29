import { error } from "@sveltejs/kit";
import { db, is_admin } from "$lib/server/database";

export async function load({ cookies }: { cookies: any }) {
  const session_id = cookies.get("session");

  if (!(await is_admin(session_id))) {
    throw error(403, "cannot access reports");
  }

  let cases = await db.query(
    `
      SELECT
        case_id,
        cases.name,
        is_open,
        type,
        subtype,
        contact_method,
        created,
        closed,
        users.name as assignee
      FROM cases
      LEFT JOIN users ON cases.assignee = users.user_id
      WHERE
        CASE
          WHEN (SELECT is_admin FROM users JOIN sessions USING (user_id) WHERE session_id = $1)
            THEN TRUE
            ELSE assignee = (SELECT user_id FROM sessions WHERE session_id = $1) OR assignee IS NULL
        END
      `,
    [session_id]
  );

  return {
    cases: cases.rows,
  };
}
