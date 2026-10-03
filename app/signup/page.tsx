'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  HeartPulse, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Stethoscope, 
  Phone, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  MapPin
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types';

export default function SignupPage() {
  const { 
    signupHospital, 
    signupDoctor, 
    signupPatient, 
    quickDemoLogin 
  } = useAuth();
  const router = useRouter();

  // Selected Role (HOSPITAL | DOCTOR | PATIENT)
  const [selectedRole, setSelectedRole] = useState<Role>('PATIENT');

  // Common State
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hospital Specific Fields
  const [hospitalName, setHospitalName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [hospitalEmail, setHospitalEmail] = useState('');
  const [hospitalPhone, setHospitalPhone] = useState('');
  const [hospitalLocation, setHospitalLocation] = useState('');
  const [hospitalSpecialty, setHospitalSpecialty] = useState('General Hospital');

  // Doctor Specific Fields
  const [doctorName, setDoctorName] = useState('');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [workingHospitalName, setWorkingHospitalName] = useState('MetroHealth Grand Medical Center');
  const [specialization, setSpecialization] = useState('Cardiologist');

  // Patient Specific Fields
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setIsSubmitting(true);

      if (selectedRole === 'HOSPITAL') {
        if (!hospitalName.trim() || !ownerName.trim() || !hospitalEmail.trim() || !hospitalPhone.trim() || !hospitalLocation.trim() || !hospitalSpecialty.trim()) {
          setError('Please fill in all hospital profile fields including location and primary specialization.');
          setIsSubmitting(false);
          return;
        }
        await signupHospital({
          hospitalName,
          ownerName,
          email: hospitalEmail,
          phoneNumber: hospitalPhone,
          location: hospitalLocation,
          specialty: hospitalSpecialty,
          password,
        });
        router.push('/hospital/dashboard');

      } else if (selectedRole === 'DOCTOR') {
        if (!doctorName.trim() || !doctorEmail.trim() || !workingHospitalName.trim() || !specialization.trim()) {
          setError('Please fill in all doctor profile fields.');
          setIsSubmitting(false);
          return;
        }
        await signupDoctor({
          doctorName: doctorName.startsWith('Dr.') ? doctorName : `Dr. ${doctorName}`,
          email: doctorEmail,
          workingHospitalName,
          specialization,
          password,
        });
        router.push('/doctor/dashboard');

      } else {
        if (!patientName.trim() || !patientEmail.trim()) {
          setError('Please provide your name and email address.');
          setIsSubmitting(false);
          return;
        }
        await signupPatient({
          name: patientName,
          email: patientEmail,
          phoneNumber: patientPhone || undefined,
          password,
        });
        router.push('/patient/dashboard');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = (type: 'PATIENT_USER' | 'DOCTOR_USER' | 'HOSPITAL_USER') => {
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
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center space-y-3 relative z-10">
        <div className="inline-flex items-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-teal-500/25">
            <HeartPulse className="w-7 h-7" />
          </div>
          <span className="font-extrabold text-3xl tracking-tight text-white">
            Ready<span className="text-teal-400">Care</span>
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Join ReadyCare Healthcare Platform
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          Choose your account type below to get custom queue management, specialist triage, and instant medical access.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl relative z-10 space-y-6">
        
        {/* ROLE SELECTION SCREEN: 3 Distinct Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          
          {/* Card 1: Register as Hospital */}
          <button
            type="button"
            onClick={() => {
              setSelectedRole('HOSPITAL');
              setError('');
            }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              selectedRole === 'HOSPITAL'
                ? 'bg-purple-950/80 border-purple-500 text-white shadow-lg shadow-purple-500/20 ring-2 ring-purple-400'
                : 'bg-white/5 border-white/10 hover:border-white/20 text-slate-300 hover:bg-white/10'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selectedRole === 'HOSPITAL' ? 'bg-purple-600 text-white' : 'bg-white/10 text-purple-400'
                }`}>
                  <Building2 className="w-5 h-5" />
                </div>
                {selectedRole === 'HOSPITAL' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                )}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-300">
                  Facility Admin
                </span>
                <h3 className="font-extrabold text-white text-sm mt-0.5">
                  Register as Hospital
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Manage clinic queues, departments, staff, and live triage throughput.
              </p>
            </div>
            <div className="pt-3 mt-2 border-t border-white/10 text-[10px] font-bold text-purple-300">
              {selectedRole === 'HOSPITAL' ? '✓ Selected Role' : 'Click to Select'}
            </div>
          </button>

          {/* Card 2: Register as Doctor */}
          <button
            type="button"
            onClick={() => {
              setSelectedRole('DOCTOR');
              setError('');
            }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              selectedRole === 'DOCTOR'
                ? 'bg-teal-950/80 border-teal-500 text-white shadow-lg shadow-teal-500/20 ring-2 ring-teal-400'
                : 'bg-white/5 border-white/10 hover:border-white/20 text-slate-300 hover:bg-white/10'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selectedRole === 'DOCTOR' ? 'bg-teal-600 text-white' : 'bg-white/10 text-teal-400'
                }`}>
                  <Stethoscope className="w-5 h-5" />
                </div>
                {selectedRole === 'DOCTOR' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                )}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-300">
                  Clinician
                </span>
                <h3 className="font-extrabold text-white text-sm mt-0.5">
                  Register as Doctor
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Consult patients, view schedule, call next patients, and handle visits.
              </p>
            </div>
            <div className="pt-3 mt-2 border-t border-white/10 text-[10px] font-bold text-teal-300">
              {selectedRole === 'DOCTOR' ? '✓ Selected Role' : 'Click to Select'}
            </div>
          </button>

          {/* Card 3: Register as Patient */}
          <button
            type="button"
            onClick={() => {
              setSelectedRole('PATIENT');
              setError('');
            }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              selectedRole === 'PATIENT'
                ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400'
                : 'bg-white/5 border-white/10 hover:border-white/20 text-slate-300 hover:bg-white/10'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selectedRole === 'PATIENT' ? 'bg-emerald-600 text-white' : 'bg-white/10 text-emerald-400'
                }`}>
                  <User className="w-5 h-5" />
                </div>
                {selectedRole === 'PATIENT' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
                  Care Seeker
                </span>
                <h3 className="font-extrabold text-white text-sm mt-0.5">
                  Register as Patient
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Explore medical facilities, pull live queue tokens, and track wait times.
              </p>
            </div>
            <div className="pt-3 mt-2 border-t border-white/10 text-[10px] font-bold text-emerald-300">
              {selectedRole === 'PATIENT' ? '✓ Selected Role' : 'Click to Select'}
            </div>
          </button>

        </div>

        {/* DYNAMIC SIGNUP FORM BASED ON SELECTED ROLE */}
        <div className="bg-white/95 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-white/20 space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600">
                Step 2: Role Profile Details
              </span>
              <h3 className="text-lg font-black text-slate-900">
                {selectedRole === 'HOSPITAL' && '🏥 Hospital Facility Registration'}
                {selectedRole === 'DOCTOR' && '🩺 Doctor & Specialist Registration'}
                {selectedRole === 'PATIENT' && '👤 Patient Account Registration'}
              </h3>
            </div>
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase ${
              selectedRole === 'HOSPITAL' ? 'bg-purple-100 text-purple-800' :
              selectedRole === 'DOCTOR' ? 'bg-teal-100 text-teal-800' :
              'bg-emerald-100 text-emerald-800'
            }`}>
              {selectedRole} Role
            </span>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            
            {/* 1. HOSPITAL SPECIFIC FIELDS */}
            {selectedRole === 'HOSPITAL' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Hospital / Facility Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                      placeholder="e.g. MetroHealth Grand Medical Center"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Owner / Chief Administrator Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g. Dr. Marcus Vance"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Official Facility Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={hospitalEmail}
                        onChange={(e) => setHospitalEmail(e.target.value)}
                        placeholder="admin@metrohealth.org"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Facility Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={hospitalPhone}
                        onChange={(e) => setHospitalPhone(e.target.value)}
                        placeholder="+1 (555) 911-0001"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Hospital Location (City/Address)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={hospitalLocation}
                        onChange={(e) => setHospitalLocation(e.target.value)}
                        placeholder="e.g. Downtown Medical District, Metro City"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Primary Specialization
                    </label>
                    <div className="relative">
                      <select
                        value={hospitalSpecialty}
                        onChange={(e) => setHospitalSpecialty(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="General Hospital">General Hospital</option>
                        <option value="24/7 Emergency">24/7 Emergency</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Orthopedics">Orthopedics</option>
                        <option value="Pediatrics">Pediatrics</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 2. DOCTOR SPECIFIC FIELDS */}
            {selectedRole === 'DOCTOR' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Doctor Full Name
                  </label>
                  <div className="relative">
                    <Stethoscope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      placeholder="e.g. Dr. Sarah Jenkins"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Doctor Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={doctorEmail}
                      onChange={(e) => setDoctorEmail(e.target.value)}
                      placeholder="dr.jenkins@metrohealth.org"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Working Hospital / Clinic
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={workingHospitalName}
                        onChange={(e) => setWorkingHospitalName(e.target.value)}
                        placeholder="e.g. MetroHealth Grand Medical"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Clinical Specialization
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all cursor-pointer font-semibold"
                      >
                        <option value="Cardiologist">Cardiologist</option>
                        <option value="Pediatrician">Pediatrician</option>
                        <option value="Neurologist">Neurologist</option>
                        <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
                        <option value="General Physician">General Physician</option>
                        <option value="Dermatologist">Dermatologist</option>
                        <option value="Emergency Medicine">Emergency Medicine</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 3. PATIENT SPECIFIC FIELDS */}
            {selectedRole === 'PATIENT' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Patient Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Alex Henderson"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="alex.henderson@example.com"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="+1 (555) 892-4112"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            {/* COMMON PASSWORD FIELD */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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

            <div className="flex items-center text-xs text-slate-500 gap-2 pt-1">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Role-based data isolation & HIPAA security enabled</span>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 px-4 text-white font-extrabold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-98 cursor-pointer disabled:opacity-70 ${
                selectedRole === 'HOSPITAL' 
                  ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/25' :
                selectedRole === 'DOCTOR' 
                  ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/25' :
                  'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
              }`}
            >
              <span>
                {isSubmitting 
                  ? 'Creating Account...' 
                  : selectedRole === 'HOSPITAL' 
                  ? 'Register Hospital & Open Command Center' 
                  : selectedRole === 'DOCTOR' 
                  ? 'Register Doctor & Launch Clinician Portal' 
                  : 'Create Patient Account & Browse Care'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 1-CLICK HACKATHON DEMO EVALUATION FOR ALL 3 ROLES */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-2 justify-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Instant 3-Role Demo Evaluation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('PATIENT_USER')}
                className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Patient (Alex)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('DOCTOR_USER')}
                className="w-full py-2 px-3 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                <span>Doctor (Dr. Jenkins)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('HOSPITAL_USER')}
                className="w-full py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-purple-600" />
                <span>Hospital (Dr. Vance)</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2 text-xs text-slate-600">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-teal-600 hover:text-teal-700 hover:underline">
              Sign in here
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
