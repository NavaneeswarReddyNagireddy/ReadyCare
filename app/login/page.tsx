'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  HeartPulse, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Activity,
  CheckCircle2,
  AlertCircle,
  User,
  Building2,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login, quickDemoLogin } = useAuth();
  const router = useRouter();

  // Form Fields: Only Email and Password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    try {
      setIsSubmitting(true);
      // Queries the database to find existing user by email & verify password. Will not create a new user.
      const loggedUser = await login(email, password);
      
      // Role-Based Redirection
      if (loggedUser.role === 'DOCTOR') {
        router.push('/doctor/dashboard');
      } else if (loggedUser.role === 'HOSPITAL' || loggedUser.role === 'HOSPITAL_ADMIN') {
        router.push('/hospital/dashboard');
      } else {
        router.push('/patient/dashboard');
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = (type: 'PATIENT_USER' | 'DOCTOR_USER' | 'HOSPITAL_USER' | 'NEW_USER') => {
    quickDemoLogin(type);
    if (type === 'DOCTOR_USER') {
      router.push('/doctor/dashboard');
    } else if (type === 'HOSPITAL_USER') {
      router.push('/hospital/dashboard');
    } else {
      router.push('/patient/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 relative z-10">
        <div className="inline-flex items-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-teal-500/25">
            <HeartPulse className="w-7 h-7" />
          </div>
          <span className="font-extrabold text-3xl tracking-tight text-white">
            Ready<span className="text-teal-400">Care</span>
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Sign In to ReadyCare
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Enter your email and password to access your role-based dashboard.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-white/20 space-y-6">
          
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* DEDICATED LOGIN FORM: Only Email and Password */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-98 cursor-pointer disabled:opacity-70"
            >
              <span>{isSubmitting ? 'Verifying Account...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Previews */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-2 justify-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick Demo Accounts</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('alex.henderson@example.com');
                  setPassword('password123');
                }}
                className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Patient (alex.henderson@example.com)</span>
                </div>
                <span className="text-[10px] text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded font-mono">Fill Form</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('dr.sarah.jenkins@metrohealth.org');
                  setPassword('password123');
                }}
                className="w-full py-2 px-3 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                  <span>Doctor (dr.sarah.jenkins@metrohealth.org)</span>
                </div>
                <span className="text-[10px] text-teal-600 bg-teal-100 px-2 py-0.5 rounded font-mono">Fill Form</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('admin@metrohealth.org');
                  setPassword('password123');
                }}
                className="w-full py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Hospital (admin@metrohealth.org)</span>
                </div>
                <span className="text-[10px] text-purple-600 bg-purple-100 px-2 py-0.5 rounded font-mono">Fill Form</span>
              </button>
            </div>
          </div>

          {/* REQUIRED UI NAVIGATION LINK */}
          <div className="text-center pt-2 text-xs text-slate-600">
            New to ReadyCare?{' '}
            <Link href="/signup" className="font-bold text-teal-600 hover:text-teal-700 hover:underline">
              Create an account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
