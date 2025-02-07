
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import {
  pgTable,
  text,
  numeric,
  integer,
  timestamp,
  pgEnum,
  serial
} from 'drizzle-orm/pg-core';
import { count, eq, ilike } from 'drizzle-orm';



import { sql } from 'drizzle-orm';
import { uuid, varchar, boolean,index } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';



export const db = drizzle(neon(process.env.POSTGRES_URL!));

export const statusEnum = pgEnum('status', ['active', 'inactive', 'archived']);

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  imageUrl: text('image_url').notNull(),
  name: text('name').notNull(),
  status: statusEnum('status').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull(),
  availableAt: timestamp('available_at').notNull()
});

export type SelectProduct = typeof products.$inferSelect;
export const insertProductSchema = createInsertSchema(products);

export async function getProducts(
  search: string,
  offset: number
): Promise<{
  products: SelectProduct[];
  newOffset: number | null;
  totalProducts: number;
}> {
  // Always search the full table, not per page
  if (search) {
    return {
      products: await db
        .select()
        .from(products)
        .where(ilike(products.name, `%${search}%`))
        .limit(1000),
      newOffset: null,
      totalProducts: 0
    };
  }

  if (offset === null) {
    return { products: [], newOffset: null, totalProducts: 0 };
  }

  let totalProducts = await db.select({ count: count() }).from(products);
  let moreProducts = await db.select().from(products).limit(5).offset(offset);
  let newOffset = moreProducts.length >= 5 ? offset + 5 : null;

  return {
    products: moreProducts,
    newOffset,
    totalProducts: totalProducts[0].count
  };
}

export async function deleteProductById(id: number) {
  await db.delete(products).where(eq(products.id, id));
}



export const users = pgTable('users', {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    email: varchar('email').unique().notNull(),
    password_hash: varchar('password_hash'), 
    google_id: varchar('google_id'),       
    is_verified: boolean('is_verified').default(false),
    created_at: timestamp('created_at').default(sql`now()`),
    updated_at: timestamp('updated_at').default(sql`now()`),
}, (table) => {
    return {
        emailIdx: index('email_idx').on(table.email),
        googleIdIdx: index('google_id_idx').on(table.google_id),
    };
});


export type SelectUser = typeof users.$inferSelect;


export const insertUserSchema = createInsertSchema(users);

// Active validation example
const newUserData = {
    email: "test@example.com",
    password_hash: "hashed_password",
    is_verified: true,
};

try {
    const validatedUser = insertUserSchema.parse(newUserData);
    console.log("Validated user data:", validatedUser);
    
} catch (error) {

    console.error("Validation error:", error);
}




