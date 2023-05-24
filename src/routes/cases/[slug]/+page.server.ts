import { error } from "@sveltejs/kit";
import { db } from "$lib/server/database";

export async function load({ params }: { params: { slug: number | "new" } }) {
  if (params.slug === "new") {
    return {
      case: null,
    };
  }

  let res = await db.query(
    `
      SELECT
        case_id,
        cases.name AS name,
        student_number,
        description,
        type,
        subtype,
        assignee,
        users.name AS assignee_name,
        is_open,
        created,
        closed
      FROM cases
      LEFT JOIN users ON cases.assignee = users.user_id
      WHERE case_id = $1
    `,
    [params.slug]
  );

  if (res.rowCount === 0) {
    throw error(404, "There is no case matching the specified id.");
  }

  return {
    case: res.rows[0],
  };
}
