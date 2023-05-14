import { redirect } from "@sveltejs/kit";
import { db } from "$lib/server/database";

export const prerender = true;

export async function load({
  request,
  cookies,
}: {
  request: any;
  cookies: any;
}) {
  const session_id = cookies.get("session");
  const url = new URL(request.url).pathname;

  let res = await db.query(
    "SELECT user_id, email, name FROM users JOIN sessions USING (user_id) WHERE session_id = $1",
    [/^([a-zA-Z0-9]){8}-(([a-zA-Z0-9]){4}-){3}([a-zA-Z0-9]){12}$/.test(session_id) ? session_id : null]
  );

  if (res.rowCount === 0) {
    cookies.delete("session");

    if (url !== "/auth/login") {
      throw redirect(307, "/auth/login");
    }
  } else if (url === "/auth/login") {
    throw redirect(307, "/");
  }

  return {
    user: res.rows[0],
  };
}
