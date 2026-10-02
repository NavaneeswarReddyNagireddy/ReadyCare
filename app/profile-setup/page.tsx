'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Briefcase, 
  Calendar, 
  HeartPulse, 
  Phone, 
  Droplet, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const OCCUPATION_SUGGESTIONS = [
  'Software Engineer / Tech',
  'Healthcare / Medical Worker',
  'Educator / Teacher',
  'Business / Finance',
  'Student',
  'Self-Employed / Freelancer',
  'Retired',
  'Civil Servant / Public Sector',
  'Other',
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

export default function ProfileSetupPage() {
  const { user, updateProfile, isLoading } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [occupation, setOccupation] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill if user has some partial data
  useEffect(() => {
    if (user) {
      if (user.fullName && user.fullName !== user.email.split('@')[0]) {
        setFullName(user.fullName);
      }
      if (user.age) setAge(user.age);
      if (user.occupation) setOccupation(user.occupation);
      if (user.phone) setPhone(user.phone);
      if (user.bloodGroup) setBloodGroup(user.bloodGroup);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full legal name.');
      return;
    }

    if (age === '' || Number(age) < 1 || Number(age) > 125) {
      setError('Please enter a valid age between 1 and 125.');
      return;
    }

    if (!occupation.trim()) {
      setError('Please select or enter your occupation.');
      return;
    }

    try {
      setIsSubmitting(true);
      await updateProfile({
        fullName: fullName.trim(),
        age: Number(age),
        occupation: occupation.trim(),
        phone: phone.trim() || undefined,
        bloodGroup: bloodGroup !== 'Unknown' ? bloodGroup : undefined,
      });

      // Redirect to main facility dashboard as required
      router.push('/');
    } catch (err: any) {
      setError(err?.message || 'Failed to complete profile setup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-slate-950 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-xl space-y-6 relative z-10">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center text-white shadow-lg">
              <HeartPulse className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              Ready<span className="text-teal-400">Care</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Complete Your Patient Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            Please provide your details so local clinics, triage physicians, and emergency response teams have accurate medical access info.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/20 p-6 sm:p-10 space-y-6">
          
          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-teal-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                Step 2 of 2: Patient Registration
              </span>
              <span className="text-slate-500">Almost Done</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 w-4/5 rounded-full transition-all duration-500" />
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Field 1: Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                1. Full Legal Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Henderson"
                  className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Field 2 & 3: Age & Occupation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  2. Age (Years) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    required
                    min={1}
                    max={125}
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 32"
                    className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  3. Occupation <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    list="occupation-list"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="e.g. Software Engineer"
                    className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                  />
                  <datalist id="occupation-list">
                    {OCCUPATION_SUGGESTIONS.map((occ) => (
                      <option key={occ} value={occ} />
                    ))}
                  </datalist>
                </div>
              </div>

            </div>

            {/* Quick Occupation Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400">Quick Select Occupation:</span>
              <div className="flex flex-wrap gap-1.5">
                {OCCUPATION_SUGGESTIONS.slice(0, 5).map((occ) => (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => setOccupation(occ)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      occupation === occ
                        ? 'bg-teal-600 text-white border-teal-600 font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Clinical Fields: Phone & Blood Group */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone (For SMS Queue Alerts)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Blood Group
                </label>
                <div className="relative">
                  <Droplet className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all cursor-pointer"
                  >
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-teal-600/25 flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-98 cursor-pointer disabled:opacity-70 pt-3"
            >
              <span>{isSubmitting ? 'Saving Patient Profile...' : 'Complete Profile & Open Hospital Dashboard'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}
