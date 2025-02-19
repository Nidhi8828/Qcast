'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from 'next-auth/react'; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showMessage, setShowMessage] = useState(false);

  const [verificationMessage, setVerificationMessage] = useState(false);

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setShowMessage(true);
    } else if (searchParams.get('emailSent') === 'true') {
      setVerificationMessage(true);
    }
    // remove the query parameter from the url
    // window.history.replaceState(null, '', '/login');
    router.replace('/login', { scroll: false });
  }, [searchParams]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        router.push('/');
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center md:items-center p-8">
      {showMessage && (
        <div className="text-black text-center p-4 rounded-lg mb-4">
          ✅ Email verified successfully! You can now log in.
        </div>
      )}
      {verificationMessage && (
        <div className="text-black text-center p-4 rounded-lg mb-4">
          📩 Verification email sent! Check your inbox.
        </div>
      )}
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Log In</CardTitle>
          <CardDescription className="text-center pt-1">
            Welcome back to Qcast!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <Link href="/forgotPassword" className="text-blue-600 text-xs px-1">
              Forgot Password?
            </Link>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center flex-col gap-y-5">
          <Button
            className="w-full flex items-center justify-center gap-2"
            onClick={() => signIn('google', { callbackUrl: '/' })}
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
            >
              <path
                fill="#4285F4"
                d="M23.49 20.57v7.68h10.77c-.44 2.46-1.87 4.54-3.96 5.94l6.42 5.01c3.74-3.46 5.89-8.55 5.89-14.63 0-1.23-.11-2.42-.32-3.57H23.49z"
              />
              <path
                fill="#34A853"
                d="M10.15 28.6c-.61-1.82-.94-3.75-.94-5.75s.33-3.93.94-5.75l-6.42-5.01A23.963 23.963 0 0 0 0 22.85c0 4.14 1.02 8.05 2.83 11.46l7.32-5.71z"
              />
              <path
                fill="#FBBC05"
                d="M23.49 9.04c3.57 0 6.76 1.23 9.3 3.62l7-6.96C35.26 2.1 29.7 0 23.49 0 14.54 0 6.9 4.84 2.83 11.46l7.32 5.71c1.94-5.74 7.31-8.13 13.34-8.13z"
              />
              <path
                fill="#EA4335"
                d="M23.49 47.98c6.21 0 11.76-2.1 16.01-5.69l-6.42-5.01c-2.49 1.65-5.54 2.63-9.3 2.63-6.02 0-11.4-3.39-13.34-8.13l-7.32 5.71c4.07 6.62 11.71 11.46 20.37 11.46z"
              />
            </svg>
            Sign in with Google
          </Button>
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
