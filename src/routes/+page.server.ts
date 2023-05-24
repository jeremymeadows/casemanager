import { db } from "$lib/server/database";
import { get_session } from "$lib/utils/auth";

export async function load({ cookies }: { cookies: any }) {
  let session_id = get_session(cookies);

  let cases = await db.query(
    `
      SELECT
        case_id,
        cases.name,
        is_open,
        type,
        created,
        closed,
        users.name as assignee
      FROM cases
      LEFT JOIN users ON cases.assignee = users.user_id
      WHERE
        CASE
          WHEN (SELECT is_admin FROM users JOIN sessions USING (user_id) WHERE session_id = $1)
            THEN TRUE
            ELSE assignee = (SELECT user_id FROM sessions WHERE session_id = $1)
        END
      `,
    [session_id]
  );

  return {
    cases: cases.rows,
  };
}
