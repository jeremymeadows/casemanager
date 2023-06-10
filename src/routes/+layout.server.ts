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
  const url = new URL(request.url).pathname;

  let user = await db.query(
    "SELECT user_id, email, name, is_admin FROM users JOIN sessions USING (user_id) WHERE session_id = $1",
    [
      /^([a-zA-Z0-9]){8}-(([a-zA-Z0-9]){4}-){3}([a-zA-Z0-9]){12}$/.test(
        session_id
      )
        ? session_id
        : null,
    ]
  );

  if (user.rowCount === 0) {
    cookies.delete("session");

    if (url !== "/auth/login") {
      throw redirect(307, "/auth/login");
    }
  } else if (url === "/auth/login") {
    throw redirect(307, "/");
  }

  let users = await db.query(
    "SELECT user_id, name, email FROM users ORDER BY user_id"
  );

  let types = await db.query(`
    SELECT
      types.name,
      STRING_AGG(subtypes.name, ';') AS subtypes
    FROM subtypes
      RIGHT JOIN types ON subtypes.parent = types.name
    GROUP BY types.name
    ORDER BY types.name
  `);

  let contact_methods = await db.query(
    "SELECT method FROM contact ORDER BY method"
  );

  return {
    user: user.rows[0],
    users: users.rows,
    types: types.rows.reduce(
      (acc, val) => (
        (acc[val.name] = val.subtypes ? val.subtypes.split(";") : []), acc
      ),
      {}
    ),
    contact_methods: contact_methods.rows.map((e) => e.method),
  };
}
