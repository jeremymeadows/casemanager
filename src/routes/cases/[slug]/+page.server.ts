import { error } from '@sveltejs/kit';
import { db } from "$lib/server/database";

export async function load({ params }: { params: { slug:number } }) {
  let res = await db.query('SELECT * FROM cases WHERE case_id = $1', [params.slug]);

  if (res.rowCount === 0) {
    throw error(404, 'There is no case matching the specified id.');
  }

  return res.rows[0]
}
