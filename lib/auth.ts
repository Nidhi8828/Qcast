import NextAuth from 'next-auth';
// import Google from 'next-auth/providers/google';
import GoogleProvider from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import { users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'you@example.com'
        },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new AuthError('Missing email or password');
        }

        // Find user in DB
        const email = credentials?.email?.toString(); // Ensure it's a string
        if (!email) {
          throw new AuthError('Invalid email');
        }
        const userResult = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);
        const user = userResult.length ? userResult[0] : null;

        if (!user || !user.password_hash) {
          throw new AuthError('Invalid email or password');
        }

        // Verify password
        const password = credentials?.password?.toString();
        if (!password) {
          throw new AuthError('Invalid password');
        }
        const isValidPassword = await bcrypt.compare(
          password,
          user.password_hash
        );
        if (!isValidPassword) {
          throw new AuthError('Invalid email or password');
        }

        return { id: user.id, email: user.email };
      }
    })
  ],
  session: {
    strategy: 'jwt' // Use JWT sessions
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      try {
        // Check if the user already exists in the database
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email))
          .limit(1);

        if (!existingUser.length) {
          // Insert new user into the database
          await db.insert(users).values({
            email: user.email,
            google_id: user.id,
            is_verified: true
          });
        }

        return true; // Allow sign-in
      } catch (error) {
        console.error('Sign-in error:', error);
        return false;
      }
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    }
  }
});
