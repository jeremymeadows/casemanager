import { json } from "@sveltejs/kit";
import { db, get_user } from "$lib/server/database";
import { get_session } from "$lib/utils/auth";

export async function POST({ cookies, request }: { cookies: any, request: any }) {
  const data = await request.json();
  await get_user(get_session(cookies));

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

export async function PUT({ cookies, request }: { cookies: any, request: any }) {
  const data = await request.json();
  await get_user(get_session(cookies));

  await db.query(
    `
      UPDATE cases SET
        name = $1,
        new = $2,
        student_number = $3,
        type = $4,
        subtype = $5,
        assignee = $6,
        is_open = $7,
        description = $8,
        contact_method = $9,
        closed = $10
      WHERE case_id = $11
    `,
    [
      data.name,
      data.new,
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

export async function PATCH({ cookies, request }: { cookies: any, request: any }) {
  const data = await request.json();
  await get_user(get_session(cookies));

  if (data.pin) {
    await db.query("INSERT INTO pins (user_id, case_id) VALUES ($1, $2)", [data.user_id, data.case_id])
  } else {
    await db.query("DELETE FROM pins WHERE user_id = $1 AND case_id = $2", [data.user_id, data.case_id])
  }
}
