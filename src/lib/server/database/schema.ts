import { sql } from 'drizzle-orm';
import { sqliteTable, primaryKey, integer, text, foreignKey } from "drizzle-orm/sqlite-core";

const table = sqliteTable;

export const users = table('users', {
    id: integer('id').notNull().primaryKey(),
    email: text('email').notNull().unique(),
    password: text('password'),
    name: text('name').notNull(),
    is_admin: integer('is_admin', { mode: 'boolean' }).notNull().default(false),
});

export const sessions = table('sessions', {
    id: text('id').notNull().primaryKey(),
    user_id: integer('user_id').notNull().references(() => users.id),
    expires: integer('expires', { mode: 'timestamp'}).notNull(),
});

export const types = table('types', {
    name: text('name').notNull().primaryKey(),
});

export const subtypes = table('subtypes', {
    parent: text('parent').notNull().references(() => types.name),
    name: text('name').notNull(),
}, (table) => [
    primaryKey({ columns: [table.parent, table.name] }),
]);

export const contact = table('contact', {
    method: text('method').notNull().primaryKey(),
});

export const cases = table('cases', {
    id: integer('id').notNull().primaryKey(),
    new: integer('new', { mode: 'boolean' }).notNull().default(true),
    name: text('name').notNull(),
    student_number: text('student_number'),
    type: text('type'),
    subtype: text('subtype'),
    assignee: integer('assignee').references(() => users.id),
    is_open: integer('is_open', { mode: 'boolean' }).notNull().default(true),
    description: text('description'),
    contact_method: text('contact_method').references(() => contact.method).default(null),
    created: integer('created', { mode: 'timestamp' }).notNull().default(sql`CURRENT_DATE`),
    closed: integer('closed', { mode: 'timestamp' }),
}, (table) => [
    foreignKey({
        columns: [table.type, table.subtype],
        foreignColumns: [subtypes.parent, subtypes.name],
    })
]);

export const pins = table('pins', {
    user_id: integer('user_id').notNull().references(() => users.id),
    case_id: integer('case_id').notNull().references(() => cases.id),
}, (table) => [
    primaryKey({ columns: [table.user_id, table.case_id] }),
]);