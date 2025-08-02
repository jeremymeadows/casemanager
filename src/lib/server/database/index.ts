import { Database as BunSqlite } from "bun:sqlite";
import { type BunSQLiteDatabase, drizzle } from "drizzle-orm/bun-sqlite";
import { sql, eq, ne } from "drizzle-orm";
// import { seed, reset } from "drizzle-seed";

import { Result } from '$lib';

import dotenv from "dotenv";

dotenv.config();

import queries from './queries';
import * as schema from './schema';
import { _ } from "$env/static/private";

export class Database {
  [key: string]: any;
  protected db: BunSQLiteDatabase<typeof schema>;
  public schema = schema;

  constructor(file: string, options: any) {
    this.db = drizzle(new BunSqlite(file, options), { schema });
    Object.assign(this, { ...queries });
  }

  async init() {
    let exists = await this.db.$count(sql`sqlite_master`);
    if (!exists) {
      await Bun.$`bunx drizzle-kit push`;
    }
  }

  get_user(session_id: string): Result<{ id: number, name: string, is_admin: boolean }> {
    if (!session_id) {
      return Result.Err(new Error("failed to get user: no session_id"));
    }

    let res = this.db.select({ id: schema.users.id, name: schema.users.name, is_admin: schema.users.is_admin })
      .from(schema.users)
      .innerJoin(schema.sessions, eq(schema.users.id, schema.sessions.user_id))
      .where(eq(schema.sessions.id, session_id))
      .get();

    if (!res) {
      return Result.Err(new Error("failed to get user: invalid session_id"));
    }

    return Result.Ok(res);
  }

  async generate(count: { users: number, cases: number } = { users: 0, cases: 100 }) {
    let types = this.get_case_types().expect();
    Object.defineProperty(types, 'null', { value: [] });
    Object.keys(types).forEach((type) => {
      types[type].push(null);
    });

    let users = this.get_users().expect().map((u: any) => u.id);
    users.push(null)

    let contact_methods = this.get_contact_methods().expect();
    contact_methods.push(null);

    console.log('case types: ', types);
    console.log(users)

    await this.db.insert(schema.cases).values([...Array(count.cases).keys()].map((i) => {
      let date = new Date(Date.now() - Math.random() * 120 * 24 * 60 * 60 * 1000);
      let open = Math.random() < 0.2;
      let close = open ? null : new Date(date.getTime() + Math.random() * (Date.now() - date.getTime()));

      let type = Object.keys(types)[Math.floor(Math.random() * Object.keys(types).length)];
      let subtype = types[type][Math.floor(Math.random() * types[type].length)];

      return ({
        name: `Case ${i + 1}`,
        student_number: `100000${i}`,
        assignee: users[Math.floor(Math.random() * users.length)],
        type,
        subtype,
        is_open: open,
        description: `Description for case ${i + 1}`,
        contact_method: contact_methods[Math.floor(Math.random() * contact_methods.length)],
        created: date,
        closed: close,
      });
    }));
  }

  async clear() {
    this.db.delete(schema.sessions).where(ne(schema.users.id, 0)).run();
    this.db.delete(schema.users).where(ne(schema.users.id, 0)).run();
  }
}

export const db = new Database("db.sqlite", { create: true });
await db.init();

// export async function get_user(
//   session_id: string
// ): Promise<{ user_id: number; email: string; name: string }> {
//   let res = await db.query(
//     "SELECT user_id, email, name FROM users JOIN sessions USING (user_id) WHERE session_id = $1",
//     [session_id]
//   );

//   return res.rows[0];
// }

// export async function is_admin(session_id: string): Promise<boolean> {
//   let res = await db.query(
//     "SELECT is_admin FROM users JOIN sessions USING (user_id) WHERE session_id = $1",
//     [session_id]
//   );

//   return res.rowCount !== 0 && res.rows[0].is_admin;
// }
