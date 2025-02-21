import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { users } from './models/users';
import { userProfiles } from './models/userprofile';


export const db = drizzle(neon(process.env.POSTGRES_URL!),);

export { users,userProfiles };