import { Client } from 'pg';

export const db = new Client({
  host: '192.0.0.9',
  user: 'root',
  password: 'toor',
  database: 'dkitsu',
  port: 5432,
})

db.connect()

export async function is_admin(session_id: string): Promise<boolean> {
  let res = await db.query(
    "SELECT is_admin FROM users JOIN sessions USING (user_id) WHERE session_id = $1",
    [session_id]
  );

  return res.rowCount !== 0 && res.rows[0].is_admin;
}

// export const sql = {};
