import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  index
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

export const db = drizzle(neon(process.env.POSTGRES_URL!));

export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  email: varchar('email').unique().notNull(),
  password_hash: varchar('password_hash'),
  google_id: varchar('google_id'),
  is_verified: boolean('is_verified').default(false),
  created_at: timestamp('created_at').default(sql`now()`),
  updated_at: timestamp('updated_at').default(sql`now()`),
  modified_at: timestamp('modified_at').default(sql`now()`),
  deleted_at: timestamp('deleted_at').default(sql`null`),
  modified_by: uuid('modified_by'),
  deleted_by: uuid('deleted_by').default(sql`null`),
}, (table) => {
  return {
    emailIdx: index('email_idx').on(table.email),
    googleIdIdx: index('google_id_idx').on(table.google_id),
  };
});

export type SelectUser = typeof users.$inferSelect;

export const insertUserSchema = createInsertSchema(users);

// const newUserData = {
//   email: "test@example.com",
//   password_hash: "hashed_password",
//   is_verified: true,
// };

// try {
//   const validatedUser = insertUserSchema.parse(newUserData);
//   console.log("Validated user data:", validatedUser);
// } catch (error) {
//   console.error("Validation error:", error);
// }
