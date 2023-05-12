import { get } from "svelte/store";
import { redirect } from "@sveltejs/kit";
import { db } from "$lib/server/database";
import { user } from "$lib/utils/stores";

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
    "SELECT user_id, name, email FROM users JOIN sessions USING (user_id) WHERE session_id = $1",
    [session_id]
  );
  if (res.rowCount === 0) {
    user.set(null);

    if (url !== "/auth/login") {
      throw redirect(307, "/auth/login");
    }
  } else if (url === "/auth/login") {
    throw redirect(307, "/");
  }

  user.set(res.rows[0]);

  return {
    user: get(user),
  };
}
