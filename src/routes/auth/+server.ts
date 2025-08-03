import { json, error } from "@sveltejs/kit";
import { db } from "$lib/server/database";

// sign in
export async function POST({
  request,
  cookies,
}: {
  request: any;
  cookies: any;
}) {
  let { email, password } = await request.json();

  let res = await db.signin(email, password);
  if (!res.ok) {
    throw error(400, res.error.message);
  }
  let { session_id, expires } = res.value;
  let user = db.get_user(session_id);

  cookies.set("session", session_id, { path: "/", expires: new Date(expires) });

  return json(user.value);
}

// sign out
export async function DELETE({ cookies }: { cookies: any }) {
  const session_id = cookies.get("session");
  await db.signout(session_id);
  cookies.delete("session", { path: "/" });

  return json(true);
}
