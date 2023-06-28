import { error } from "@sveltejs/kit";
import { db, get_user } from "$lib/server/database";
import { get_session } from "$lib/utils/auth";

export async function load({
  params,
  cookies,
}: {
  params: { slug: number | "new" };
  cookies: any;
}) {
  if (params.slug === "new") {
    return {
      case: null,
    };
  }

  let session_id = get_session(cookies);

  let res = await db.query(
    `
      SELECT
        cases.*,
        users.name AS assignee_name
      FROM cases
      LEFT JOIN users ON cases.assignee = users.user_id
      WHERE case_id = $1 AND
        CASE
          WHEN (SELECT is_admin FROM users JOIN sessions USING (user_id) WHERE session_id = $2)
            THEN TRUE
          ELSE assignee = (SELECT user_id FROM sessions WHERE session_id = $2) OR assignee IS NULL
        END
    `,
    [params.slug, session_id]
  );

  if (res.rowCount === 0) {
    throw error(404, "There is no case matching the specified id.");
  }

  let uid = (await get_user(session_id)).user_id;
  console.log(uid);
  console.log(res.rows[0].assignee);
  if (res.rows[0].new && res.rows[0].assignee === (await get_user(session_id)).user_id) {
    console.log("Marking case as read");
    db.query("UPDATE cases SET new = FALSE WHERE case_id = $1", [params.slug]);
  }

  return {
    case: res.rows[0],
  };
}
