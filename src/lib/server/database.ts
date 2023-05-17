import { error } from "@sveltejs/kit";
import { Client } from "pg";

// import { Prisma, PrismaClient } from "@prisma/client";
// import type { users } from "@prisma/client";
// const prisma = new PrismaClient();

export const db = new Client({
  host: "192.0.0.10",
  user: "root",
  password: "toor",
  database: "dkitsu",
  port: 5432,
});

db.connect().catch(() => {
  error(500, "failed to establish database connection");
});

export async function get_user(
  session_id: string
): Promise<{ user_id: number; email: string; name: string }> {
  // export async function get_user(session_id: string) {
  // let res2 = await prisma.sessions.findUniqueOrThrow({
  //   include: {
  //     users: true,
  //   }
  // })
  // let res = await prisma.users.findUniqueOrThrow({
  //   select: {
  //     user_id: true,
  //     email: true,
  //     name: true,
  //     sessions: {
  //       where: {
  //         session_id: session_id,
  //       }
  //     }
  //   },
  //   // where: {
  //   //   sessions: {
  //   //     is: {
  //   //       session_id: session_id,
  //   //     },
  //   //     // session_id: session_id,
  //   //   },
  //   // },
  // });
  // const out: Prisma.usersSelect = {
  //   user_id: true,
  //   email: true,
  //   name: true,
  // };
  // let res: {user_id: number, email: string, name: string} = await prisma.$queryRaw`SELECT user_id, email, name FROM users JOIN sessions USING (user_id) WHERE session_id = ${session_id}`
  // return res[0];
  let res = await db.query(
    "SELECT user_id, email, name FROM users JOIN sessions USING (user_id) WHERE session_id = $1",
    [session_id]
  );

  return res.rows[0];
}

export async function is_admin(session_id: string): Promise<boolean> {
  let res = await db.query(
    "SELECT is_admin FROM users JOIN sessions USING (user_id) WHERE session_id = $1",
    [session_id]
  );

  return res.rowCount !== 0 && res.rows[0].is_admin;
}
