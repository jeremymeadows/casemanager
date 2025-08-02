import { Result } from "$lib/utils/result";
import { and, eq } from "drizzle-orm";
import { Database } from "..";

export function add_type(this: Database, name: string): Result<void> {
    this.db.insert(this.schema.types).values({
        name
    }).run();
    return Result.Ok(null);
}

export function add_subtype(this: Database, parent: string, name: string): Result<void> {
    this.db.insert(this.schema.subtypes).values({
        parent,
        name
    }).run();
    return Result.Ok(null);
}

export function delete_subtype(this: Database, parent: string, name: string): Result<void> {
    this.db.update(this.schema.cases)
        .set({ subtype: null })
        .where(and(
            eq(this.schema.cases.subtype, name),
            eq(this.schema.cases.type, parent)
        ))
        .run();

    this.db.delete(this.schema.subtypes)
        .where(and(
            eq(this.schema.subtypes.parent, parent),
            eq(this.schema.subtypes.name, name)
        ))
        .run();
    return Result.Ok(null);
}

export function delete_type(this: Database, name: string): Result<void> {
    this.db.update(this.schema.cases)
        .set({ type: null, subtype: null })
        .where(eq(this.schema.cases.type, name))
        .run();

    this.db.delete(this.schema.subtypes)
        .where(eq(this.schema.subtypes.parent, name))
        .run();

    this.db.delete(this.schema.types)
        .where(eq(this.schema.types.name, name))
        .run();
    return Result.Ok(null);
}

export function add_contact_method(this: Database, method: string): Result<void> {
    this.db.insert(this.schema.contact).values({
        method
    }).run();
    return Result.Ok(null);
}

export function delete_contact_method(this: Database, method: string): Result<void> {
    this.db.update(this.schema.cases)
        .set({ contact_method: null })
        .where(eq(this.schema.cases.contact_method, method))
        .run();

    this.db.delete(this.schema.contact)
        .where(eq(this.schema.contact.method, method))
        .run();
    return Result.Ok(null);
}

export function get_contact_methods(this: Database): Result<string[]> {
    let methods = this.db.select({ method: this.schema.contact.method })
        .from(this.schema.contact)
        .all()
        .map(e => e.method);
    return Result.Ok(methods);
}