import { db } from "$lib/server/database";
import { get_session } from "$lib/utils/auth";

export async function load({
  params,
  cookies,
}: {
  params: { slug: number | "new" };
  cookies: any;
}) {
  let session_id = get_session(cookies);

  return {
    case: params.slug === "new" ? null : db.get_case(params.slug, session_id).expect(),
    users: db.get_users().expect(),
    contact_methods: db.get_contact_methods().expect(),
  };
}
