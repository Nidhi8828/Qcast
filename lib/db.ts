import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { users } from './models/users';

export const db = drizzle(neon(process.env.POSTGRES_URL!),);

export { users };