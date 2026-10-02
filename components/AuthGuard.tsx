'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { HeartPulse } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const isAuthPage = pathname === '/signup' || pathname === '/login';
    const isProfileSetupPage = pathname === '/profile-setup';

    // 1. If not authenticated
    if (!user) {
      if (!isAuthPage) {
        router.replace('/signup');
      }
      return;
    }

    // 2. If authenticated but profile is incomplete
    if (!user.isProfileComplete) {
      if (!isProfileSetupPage) {
        router.replace('/profile-setup');
      }
      return;
    }

    // 3. If authenticated and profile is complete
    if (user.isProfileComplete) {
      if (isAuthPage || isProfileSetupPage) {
        router.replace('/');
      }
    }
  }, [user, isLoading, pathname, router]);

  // Loading spinner while checking local auth session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center space-y-4 text-white">
        <div className="w-12 h-12 rounded-2xl bg-teal-500 flex items-center justify-center shadow-lg animate-pulse">
          <HeartPulse className="w-7 h-7 text-white animate-bounce" />
        </div>
        <div className="text-center space-y-1">
          <p className="font-extrabold text-lg tracking-tight">Ready<span className="text-teal-400">Care</span></p>
          <p className="text-xs text-slate-400">Verifying secure medical session...</p>
        </div>
      </div>
    );
  }

  // Prevent flash of protected content if redirecting
  const isAuthPage = pathname === '/signup' || pathname === '/login';
  const isProfileSetupPage = pathname === '/profile-setup';

  if (!user && !isAuthPage) {
    return null;
  }

  if (user && !user.isProfileComplete && !isProfileSetupPage) {
    return null;
  }

  return <>{children}</>;
}
