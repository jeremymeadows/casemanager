import { db } from "$lib/server/database";

export async function load({ cookies }: { cookies: any }) {
  let cases = await db.query("SELECT case_id, status, type, created, users.name as assignee FROM cases JOIN users ON cases.assignee = users.user_id");

  return {
    cases: cases.rows,
 };
}
