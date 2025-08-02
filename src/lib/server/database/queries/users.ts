import { Result } from "$lib/utils/result";
import { eq } from "drizzle-orm";
import { Database } from "..";

export function get_users(this: Database): Result<any[]> {
    let u = this.db.select({ id: this.schema.users.id, name: this.schema.users.name, email: this.schema.users.email, is_admin: this.schema.users.is_admin }).from(this.schema.users).all();
    return Result.Ok(u);
}

export function add_user(this: Database, name: string, email: string, admin: boolean): Result<number> {
    return Result.Ok(
        this.db.insert(this.schema.users)
            .values({ name, email, is_admin: admin })
            .returning({ user_id: this.schema.users.id })
            .get()
            .user_id
    );
}

export function edit_user(this: Database, user_id: number, name: string, email: string, admin: boolean): Result<void> {
    this.db.update(this.schema.users)
        .set({ name, email, is_admin: admin })
        .where(eq(this.schema.users.id, user_id))
        .run();
    return Result.Ok(null);
}

export function delete_user(this: Database, user_id: number): Result<void> {
    this.db.update(this.schema.cases).set({ assignee: null })
        .where(eq(this.schema.cases.assignee, user_id))
        .run();

    this.db.delete(this.schema.sessions)
        .where(eq(this.schema.sessions.user_id, user_id))
        .run();
    this.db.delete(this.schema.pins)
        .where(eq(this.schema.pins.user_id, user_id))
        .run();

    this.db.delete(this.schema.users)
        .where(eq(this.schema.users.id, user_id))
        .run();

    return Result.Ok(null);
}

export function reset_password(this: Database, user_id: number, password: string): Result<void> {
    this.db.update(this.schema.users)
        .set({ password })
        .where(eq(this.schema.users.id, user_id))
        .run();
    return Result.Ok(null);
}