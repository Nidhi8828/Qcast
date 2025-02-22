import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  index,
  date
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

export const db = drizzle(neon(process.env.POSTGRES_URL!));

export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  email: varchar('email', { length: 255 }).unique().notNull(), 
  first_name: varchar('first_name', { length: 50 }).notNull(),
  last_name: varchar('last_name', { length: 50 }).notNull(),
  date_of_birth: date('date_of_birth').notNull(),
  location_city: varchar('location_city', { length: 100 }).notNull(),
  location_country: varchar('location_country', { length: 100 }).notNull(),
  likes: varchar('likes', { length: 255 }).notNull(), // Tag list stored as comma-separated values
  profile_picture: varchar('profile_picture', { length: 255 }).default(sql`null`), // URL or file path to the profile picture
  created_at: timestamp('created_at').default(sql`now()`),
  modified_at: timestamp('modified_at').default(sql`now()`),
  deleted_at: timestamp('deleted_at').default(sql`null`),
  created_by: uuid('created_by'),
  modified_by: uuid('modified_by'),
  deleted_by: uuid('deleted_by').default(sql`null`)
}, (table) => {
  return {
    emailIndex: index('email_index').on(table.email),
    locationIdx: index('location_idx').on(table.location_city, table.location_country),
  };
});

export type SelectUserProfile = typeof userProfiles.$inferSelect;

export const insertUserProfileSchema = createInsertSchema(userProfiles);

// Example validation and usage
// const newProfileData = {
//   email: "nidhi.dasari765734@gmail.com",
//   first_name: "John",
//   last_name: "Doe",
//   date_of_birth: "1990-01-01",
//   location_city: "New York",
//   location_country: "USA",
//   likes: "coding,reading,traveling",
//   profile_picture: "https://example.com/images/profile.jpg",
// };

// try {
//   const validatedProfile = insertUserProfileSchema.parse(newProfileData);
//   console.log("Validated profile data:", validatedProfile);
//   (async () => {
//     await db.insert(userProfiles).values(validatedProfile);
//     console.log("Profile successfully inserted into the database!");
// })();
 
// } catch (error) {
//   console.error("Validation error:", error);
// }
