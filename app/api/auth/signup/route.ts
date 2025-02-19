import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { sendVerificationEmail } from '@/lib/verificationEmail';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      );
    }

    let userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    let existingUser = userResult.length ? userResult[0] : null;

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(users)
      .values({ email, password_hash: hashedPassword, is_verified: false })
      .returning({
        id: users.id,
        email: users.email
      });

    const token = jwt.sign({ email }, process.env.JWT_SECRET as string, {
      expiresIn: '24h'
    });

    await sendVerificationEmail(email, token);

    return NextResponse.json(
      {
        message:
          'User registered successfully. Check your email for verification.',
        user: newUser
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in user registration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
