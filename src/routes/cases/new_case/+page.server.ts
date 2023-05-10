import { db } from "$lib/server/database";
// import type { PageServerLoad } from "./$types";

// export async function load({ params } : { params:PageServerLoad }) {
export async function load() {
  let users = await db.query("SELECT user_id as id, CONCAT(name, ' <', email, '>') as name FROM users");
  let types = await db.query("SELECT name, STRING_AGG(subtype, ';') as subtypes FROM types GROUP BY name");
  types.rows.forEach((e) => e.subtypes = e.subtypes.split(';'));

  return {
    post: {
      users: users.rows,
      types: types.rows,
    }
 };
}
