import { type Database } from '../index';
import { and, eq, or } from 'drizzle-orm';
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

export function create_case(this: Database, data: any): Result<number> {
    let res = this.db
        .insert(this.schema.cases)
        .values({
            name: data.name,
            student_number: data.student_number,
            type: data.type,
            subtype: data.subtype,
            assignee: data.assignee,
            is_open: data.is_open,
            description: data.description,
            contact_method: data.contact_method,
            closed: data.is_open ? null : new Date()
        })
        .returning({ id: this.schema.cases.id })
        .get();

    return Result.Ok(res.id);
}

export function edit_case(this: Database, data: any): Result<void> {
    this.db
        .update(this.schema.cases)
        .set({
            name: data.name,
            new: data.new,
            student_number: data.student_number,
            type: data.type,
            subtype: data.subtype,
            assignee: data.assignee,
            is_open: data.is_open,
            description: data.description,
            contact_method: data.contact_method,
            closed: data.is_open ? null : (data.just_closed ? new Date() : data.closed)
        })
        .where(eq(this.schema.cases.id, data.case_id))
        .run();

    return Result.Ok(null);
}

export function pin_case(this: Database, user_id: number, case_id: number, pin: boolean): Result<void> {
    if (pin) {
        this.db.insert(this.schema.pins)
            .values({
                user_id,
                case_id,
            })
            .onConflictDoNothing()
            .run();
    } else {
        this.db.delete(this.schema.pins)
            .where(
                and(
                    eq(this.schema.pins.user_id, user_id),
                    eq(this.schema.pins.case_id, case_id),
                )
            )
            .run();
    }
    return Result.Ok(null);
}