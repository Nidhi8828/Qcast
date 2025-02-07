"use client"
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useState } from 'react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); 

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, isVerified }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || 'User created successfully!');
      } else {
        setMessage(data.error || 'Failed to create user.');
      }
    } catch (error) {
      setMessage('An unexpected error occurred.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start md:items-center p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Signup</CardTitle>
          <CardDescription>
            Register with your email and password to create an account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full border rounded-lg p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border rounded-lg p-2"
                required
              />
            </div>
            <div className="flex items-center">
              <input
                id="isVerified"
                type="checkbox"
                checked={isVerified}
                onChange={(e) => setIsVerified(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="isVerified" className="text-sm">
                Mark as Verified
              </label>
            </div>
          </div>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit">
              Signup
            </Button>
            {message && <p className="text-sm text-center">{message}</p>}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
