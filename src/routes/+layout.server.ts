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

  return {
    types: db.get_case_types().expect(),
  }
}
