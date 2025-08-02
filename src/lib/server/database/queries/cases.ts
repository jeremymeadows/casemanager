import { type Database } from '../index';
import { eq, or } from 'drizzle-orm';
import { Result } from '$lib';

export async function get_cases(this: Database, session_id: string): Promise<Result<any[]>> {
    let user = this.get_user(session_id);
    if (!user.ok) {
        return Result.Err(user.error);
    }

    let query: any = this.db
        .select()
        .from(this.schema.cases)
        .leftJoin(this.schema.users, eq(this.schema.cases.assignee, this.schema.users.id));

    if (!user.value.is_admin) {
        query = query.where(or(
            eq(this.schema.cases.assignee, user.value.id),
            eq(this.schema.cases.assignee, null))
        );
    }

    let c = query.all().map((e: any) => {
        e.cases.assignee = e.users;
        e.cases.created = new Date(e.cases.created);
        return e.cases;
    });

    return Result.Ok(c);
}

export function get_case_types(this: Database): Result<any[]> {
    let types: any = {};
    this.db.select({
        type: this.schema.types.name,
        subtype: this.schema.subtypes.name
    })
    .from(this.schema.types)
    .leftJoin(this.schema.subtypes, eq(this.schema.types.name, this.schema.subtypes.parent))
    .all()
    .forEach((e) => {
        if (!types[e.type]) {
            types[e.type] = [];
        }
        if (e.subtype) {
            types[e.type].push(e.subtype);
        }
    });

    return Result.Ok(types);
}

export function get_case(this: Database, id: number): Result<any> {
    let c = this.db
        .select()
        .from(this.schema.cases)
        .where(eq(this.schema.cases.id, id))
        .leftJoin(this.schema.users, eq(this.schema.cases.assignee, this.schema.users.id))
        .get();
    if (!c) {
        return Result.Err(new Error(`Case with id ${id} not found`));
    }
    c.cases.created = new Date(c.cases.created);
    return Result.Ok({ ...c.cases, assignee: c.users });
}