import { json } from "@sveltejs/kit";
import { db } from "$lib/server/database";

export async function POST({
  request,
  cookies,
}: {
  request: any;
  cookies: any;
}) {
  const data = await request.json();

  let res = await db.query(
    "INSERT INTO cases (name, student_number, type, subtype, assignee, is_open, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING case_id",
    [
      data.name,
      data.student_number,
      data.type,
      data.subtype,
      data.assignee,
      data.status,
      data.description,
    ]
  );
  console.log(res)

  return json(res.rows[0].case_id);
}
