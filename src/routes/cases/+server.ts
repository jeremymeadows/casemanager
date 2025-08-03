import { error, json, redirect } from "@sveltejs/kit";

import { db } from "$lib/server/database";
import { get_session } from "$lib/utils/auth";

export async function GET() {
  throw redirect(307, '/cases/all');
}

// new case
export async function POST({ cookies, request }: { cookies: any, request: any }) {
  const data = await request.json();
  const user = db.get_user(get_session(cookies));

  if (!user.ok) {
    return error(403, "You must be logged in to create a case");
  }

  let id = db.create_case(data);
  return json(id.value);
}

// edit case
export async function PUT({ cookies, request }: { cookies: any, request: any }) {
  const data = await request.json();
  const user = db.get_user(get_session(cookies));

  if (!user.ok) {
    return error(403, "You must be logged in to update a case");
  }

  db.edit_case(data);
  return json(true);
}

export async function PATCH({ cookies, request }: { cookies: any, request: any }) {
  const data = await request.json();
  const user = db.get_user(get_session(cookies));

  if (!user.ok) {
    return error(403, "You must be logged in to update a case");
  }

  db.pin_case(user.value.id, data.id, data.pinned);
  return json(true);
}
