'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import { signIn } from 'next-auth/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { googleSignIn } from 'app/api/auth/google/route';
import TurnstileComponent from '@/components/turnstile'

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

    const [token, setToken] = useState('');


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
  
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
  
    try {
    
      const captchaResponse = await fetch('/api/auth/validate-captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token }),
      });
  
      const captchaData = await captchaResponse.json();
  
      if (!captchaResponse.ok || !captchaData.success) {
        setError(captchaData.error || 'CAPTCHA validation failed');
        return;
      }
  
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        router.push('/login?emailSent=true');
      } else {
        const data = await response.json();
        setError(data.error || 'An error occurred during signup');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center md:items-center p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Sign Up</CardTitle>
          <CardDescription className="text-center pt-1">
            Create your Qcast account
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
            </div>
            <TurnstileComponent  onToken={(token) => {
              console.log("CAPTCHA token:", token);
              setToken(token)}}/>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center flex-col gap-y-5">
        <form
            action={googleSignIn} 
            className="w-full"
          >
            <Button className="w-full flex items-center justify-center gap-2">
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
              Sign up with Google
            </Button>
          </form>
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
