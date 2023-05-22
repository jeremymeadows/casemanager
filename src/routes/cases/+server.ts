import { json } from "@sveltejs/kit";
import { db } from "$lib/server/database";

export async function POST({ request }: { request: any }) {
  const data = await request.json();
  console.log(data)

  let res = await db.query(
    `
      INSERT INTO cases (name, student_number, type, subtype, assignee, is_open, description) VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING case_id
    `,
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

  return json(res.rows[0].case_id);
}

export async function PUT({ request }: { request: any }) {
  const data = await request.json();

  await db.query(
    `
      UPDATE cases SET
        name = $1,
        student_number = $2,
        type = $3,
        subtype = $4,
        assignee = $5,
        is_open = $6,
        description = $7
      WHERE case_id = $8
    `,
    [
      data.name,
      data.student_number,
      data.type,
      data.subtype,
      data.assignee,
      data.status,
      data.description,
      data.case_id,
    ]
  );

  return json(true);
}
