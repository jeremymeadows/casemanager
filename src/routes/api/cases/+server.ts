import { json } from "@sveltejs/kit";
import { db } from "$lib/server/database";

export async function POST({ request }: { request: any }) {
  const data = await request.json();

  let res = await db.query(
    `
      INSERT INTO cases (name, student_number, type, subtype, assignee, is_open, description, contact_method, closed) VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING case_id
    `,
    [
      data.name,
      data.student_number,
      data.type,
      data.subtype,
      data.assignee,
      data.is_open,
      data.description,
      data.contact_method,
      data.is_open ? null : new Date(),
    ]
  );

  return json(res.rows[0].case_id);
}

export async function PUT({ request }: { request: any }) {
  const data = await request.json();
  console.log(data)

  await db.query(
    `
      UPDATE cases SET
        name = $1,
        student_number = $2,
        type = $3,
        subtype = $4,
        assignee = $5,
        is_open = $6,
        description = $7,
        contact_method = $8,
        closed = $9
      WHERE case_id = $10
    `,
    [
      data.name,
      data.student_number,
      data.type,
      data.subtype,
      data.assignee,
      data.is_open,
      data.description,
      data.contact_method,
      data.is_open ? null : (data.just_closed ? new Date() : data.closed),
      data.case_id,
    ]
  );

  return json(true);
}
