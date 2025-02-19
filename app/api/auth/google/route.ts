// 'use server';

// import { signIn } from '@/lib/auth';

// export async function googleSignIn() {
//   await signIn('google', { redirectTo: '/' });
// }

import { signIn } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  return signIn('google', { redirectTo: '/' });
}
