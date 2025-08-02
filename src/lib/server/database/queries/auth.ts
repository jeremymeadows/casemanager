import { randomBytes } from 'crypto';
import { eq } from 'drizzle-orm';

import { Result } from '$lib';

import { Database } from '../index';
import { random_string } from "$lib/utils/misc";

import { users, sessions } from '../schema';

export async function signin(this: Database, email: string, password: string): Promise<Result<{ session_id: string; expires: Date }>> {
  let user = this.db
    .select({ user_id: users.id, password: users.password })
    .from(users)
    .where(eq(users.email, email))
    .get();
  if (!user || !(await Bun.password.verify(password, user.password))) {
    return Result.Err(new Error("no account with matching credentials"));
  }

  let session_id = randomBytes(24).toHex();
  let expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  this.db.insert(sessions).values({
    id: session_id,
    user_id: user.user_id,
    expires,
  }).run();

  return Result.Ok({ session_id, expires });
}

export async function signout(this: Database, session_id: string): Promise<Result<null>> {
  this.db.delete(sessions).where(eq(sessions.id, session_id)).run();
  return Result.Ok(null);
}

export async function create_account(this: Database, email: string, name: string, password: string): Promise<Result<number>> {
  let user = this.db.insert(users)
    .values({
      name,
      email,
      password: Bun.password.hashSync(password),
      is_admin: false,
    })
    .returning({ user_id: users.id })
    .get();

  return Result.Ok(user.user_id);
}

export async function delete_account(this: Database, user_id: number): Promise<Result<null>> {
  if (user_id === 0) {
    return Result.Err(new Error("cannot delete the default admin account"));
  }

  this.db.delete(sessions).where(eq(sessions.user_id, user_id)).run();
  this.db.delete(users).where(eq(users.id, user_id)).run();
  return Result.Ok(null);
}

export async function update_details(this: Database, session_id: string, user_id: number, { email, name }: { email?: string; name?: string }): Promise<Result<null>> {
  const user = this.get_user(session_id);
  user.match({
    ok: (user) => {
      if (!user.is_admin) {
        return Result.Err(new Error("cannot modify user accounts"));
      }

      if (email) {
        this.db.update(users).set({ email }).where(eq(users.id, user_id)).run();
      }
      if (name) {
        this.db.update(users).set({ name }).where(eq(users.id, user_id)).run();
      }
    },
    err: (err) => Result.Err(err)
  })
  return Result.Ok(null);
}

// reset/change password
export async function update_password(this: Database, session_id: string, user_id: number, password?: string, old_password?: string): Promise<Result<string | null>> {
  const user = this.get_user(session_id);
  return user.match({
    ok: (user) => {
      if (!user.is_admin && user.id !== user_id) {
        return Result.Err(new Error("cannot modify user accounts"));
      }

      if (user.id !== user_id) {
        password = password ?? random_string(16);
      } else {
        const hash = this.db.select({ password: users.password }).from(users).where(eq(users.id, user_id)).get()?.password;
        if (old_password && !(Bun.password.verifySync(old_password, hash))) {
          return Result.Err(new Error("old password does not match"));
        }
      }
      this.db.update(users).set({ password: Bun.password.hashSync(password) }).where(eq(users.id, user_id)).run();
      return Result.Ok(user.id === user_id ? null : password);
    },
    err: (err) => Result.Err(err)
  });
}

