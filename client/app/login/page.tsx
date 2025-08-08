'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import LoginForm from '@/components/login-form';
import { useAuth } from '@/components/auth-provider';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const redirectTo = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  const handleLoginSuccess = () => {
    router.push(redirectTo);
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-300">Sign in to book your event tickets</p>
        </div>
        <LoginForm onSuccess={handleLoginSuccess} />
        <div className="mt-6 text-center">
          <Link 
            href="/forgot-password" 
            className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}