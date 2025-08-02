import { redirect } from "@sveltejs/kit";
import { db } from "$lib/server/database";

export async function load({
  request,
  cookies,
}: {
  request: any;
  cookies: any;
}) {
  const session_id = cookies.get("session");
  
  if (!session_id && new URL(request.url).pathname !== "/auth/login") {
    console.log('no session')
    throw redirect(307, "/auth/login");
  }

  const user = db.get_user(session_id);
  const url = new URL(request.url).pathname;

  if (!user.ok) {
    cookies.delete("session", { path: "/" });

    if (url !== "/auth/login") {
      throw redirect(307, "/auth/login");
    }
  } else if (url === "/auth/login") {
    throw redirect(307, "/");
  }

  // let users = await db.query(
  //   "SELECT user_id, name, email FROM users ORDER BY user_id"
  // );

  // let new_cases = await db.query(
  //   "SELECT COUNT(*) AS count FROM cases WHERE assignee = $1 AND new = TRUE",
  //   [user.rows[0].user_id]
  // );

  // let types = await db.query(`
  //   SELECT
  //     types.name,
  //     STRING_AGG(subtypes.name, ';') AS subtypes
  //   FROM subtypes
  //     RIGHT JOIN types ON subtypes.parent = types.name
  //   GROUP BY types.name
  //   ORDER BY types.name
  // `);

  // let contact_methods = await db.query(
  //   "SELECT method FROM contact ORDER BY method"
  // );

  // return {
  //   user: user.rows[0],
  //   has_new_cases: new_cases.rows[0].count > 0,
  //   users: users.rows,
  //   types: types.rows.reduce(
  //     (acc, val) => (
  //       (acc[val.name] = val.subtypes ? val.subtypes.split(";") : []), acc
  //     ),
  //     {}
  //   ),
  //   contact_methods: contact_methods.rows.map((e) => e.method),
  // };
  return {
    types: db.get_case_types().expect(),
  }
}
