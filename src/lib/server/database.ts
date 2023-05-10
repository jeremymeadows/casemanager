import { Client } from 'pg';

export const db = new Client({
  host: '192.0.0.9',
  user: 'root',
  password: 'toor',
  database: 'dkitsu',
  port: 5432,
})

db.connect()

export const sql = {};
