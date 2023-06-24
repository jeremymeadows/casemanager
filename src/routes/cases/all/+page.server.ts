import { db } from "$lib/server/database";
import { get_session } from "$lib/utils/auth";

export async function load({ cookies }: { cookies: any }) {
  let session_id = get_session(cookies);

  let cases = await db.query(
    `
      SELECT
        case_id,
        new,
        cases.name,
        assignee AS user_id,
        student_number,
        is_open,
        type,
        subtype,
        contact_method,
        created,
        closed,
        description,
        users.name AS assignee
      FROM cases
      LEFT JOIN users ON cases.assignee = users.user_id
      WHERE
        CASE
          WHEN (SELECT is_admin FROM users JOIN sessions USING (user_id) WHERE session_id = $1)
            THEN TRUE
          ELSE assignee = (SELECT user_id FROM sessions WHERE session_id = $1) OR assignee IS NULL
        END
      ORDER BY is_open DESC, created
      `,
    [session_id]
  );

  let pins = await db.query("SELECT case_id FROM pins WHERE user_id = (SELECT user_id FROM sessions WHERE session_id = $1)", [session_id]);

  return {
    cases: cases.rows,
    pins: pins.rows.map((e) => e.case_id),
  };
}
