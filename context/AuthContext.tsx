'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Role, HospitalProfile, DoctorProfile, PatientProfile } from '@/types';
import { authenticateUserAction, registerUserRecordAction } from '@/app/actions/auth';

export interface SignupHospitalPayload {
  hospitalName: string;
  ownerName: string;
  email: string;
  phoneNumber: string;
  location: string;
  specialty: string;
  password?: string;
}

export interface SignupDoctorPayload {
  doctorName: string;
  email: string;
  workingHospitalName: string;
  specialization: string;
  password?: string;
}

export interface SignupPatientPayload {
  name: string;
  email: string;
  phoneNumber?: string;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signupHospital: (data: SignupHospitalPayload) => Promise<User>;
  signupDoctor: (data: SignupDoctorPayload) => Promise<User>;
  signupPatient: (data: SignupPatientPayload) => Promise<User>;
  signup: (email: string, password?: string, fullName?: string, role?: Role | UserRole, hospitalId?: string) => Promise<User>;
  login: (email: string, password?: string) => Promise<User>;
  updateProfile: (data: { fullName: string; age: number; occupation: string; phone?: string; bloodGroup?: string }) => Promise<User>;
  logout: () => void;
  quickDemoLogin: (type: 'PATIENT_USER' | 'DOCTOR_USER' | 'HOSPITAL_USER' | 'NEW_USER') => void;
  toggleRole: () => void;
  setRole: (role: Role | UserRole) => void;
  setHospitalTenant: (hospitalId: string, hospitalName: string) => void;
}

const AUTH_STORAGE_KEY = 'readycare_auth_user';

export const DEMO_PATIENT_USER: User = {
  id: 'usr-patient-1',
  email: 'alex.henderson@example.com',
  fullName: 'Alex Henderson',
  role: 'PATIENT',
  age: 34,
  occupation: 'Senior Systems Architect',
  phone: '+1 (555) 892-4112',
  bloodGroup: 'O+',
  isProfileComplete: true,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  patientProfile: {
    id: 'prof-pat-1',
    userId: 'usr-patient-1',
    name: 'Alex Henderson',
    email: 'alex.henderson@example.com',
    phoneNumber: '+1 (555) 892-4112',
    createdAt: '2026-09-01T10:00:00Z',
  },
  createdAt: '2026-09-01T10:00:00Z',
};

export const DEMO_DOCTOR_USER: User = {
  id: 'usr-doctor-1',
  email: 'dr.sarah.jenkins@metrohealth.org',
  fullName: 'Dr. Sarah Jenkins',
  role: 'DOCTOR',
  age: 39,
  occupation: 'Lead Interventional Cardiologist',
  phone: '+1 (555) 234-5678',
  bloodGroup: 'B+',
  hospitalId: 'fac-1',
  hospitalName: 'MetroHealth Grand Medical Center',
  isProfileComplete: true,
  avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
  doctorProfile: {
    id: 'prof-doc-1',
    userId: 'usr-doctor-1',
    doctorName: 'Dr. Sarah Jenkins',
    email: 'dr.sarah.jenkins@metrohealth.org',
    workingHospitalName: 'MetroHealth Grand Medical Center',
    specialization: 'Interventional Cardiologist',
    createdAt: '2026-09-01T10:00:00Z',
  },
  createdAt: '2026-09-01T10:00:00Z',
};

export const DEMO_HOSPITAL_USER: User = {
  id: 'usr-hospital-1',
  email: 'admin@metrohealth.org',
  fullName: 'Dr. Marcus Vance (Chief Admin)',
  role: 'HOSPITAL',
  hospitalId: 'fac-1',
  hospitalName: 'MetroHealth Grand Medical Center',
  age: 46,
  occupation: 'Chief Medical Officer & Facility Administrator',
  phone: '+1 (555) 911-0001',
  bloodGroup: 'A+',
  isProfileComplete: true,
  avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
  hospitalProfile: {
    id: 'prof-hosp-1',
    userId: 'usr-hospital-1',
    hospitalName: 'MetroHealth Grand Medical Center',
    ownerName: 'Dr. Marcus Vance',
    email: 'admin@metrohealth.org',
    phoneNumber: '+1 (555) 911-0001',
    location: 'Downtown Medical District, Metro City',
    specialty: 'Cardiology',
    createdAt: '2026-09-01T10:00:00Z',
  },
  createdAt: '2026-09-01T10:00:00Z',
};

const DEMO_NEW_USER: User = {
  id: 'usr-new-' + Date.now(),
  email: 'sarah.miller@example.com',
  fullName: 'Sarah Miller',
  role: 'PATIENT',
  isProfileComplete: false,
  createdAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading auth from localStorage:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 1. Role-specific signup for HOSPITAL
  const signupHospital = async (data: SignupHospitalPayload): Promise<User> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 400));

    const userId = `usr-hosp-${Date.now()}`;
    const hospitalProfile: HospitalProfile = {
      id: `prof-hosp-${Date.now()}`,
      userId,
      hospitalName: data.hospitalName.trim(),
      ownerName: data.ownerName.trim(),
      email: data.email.trim().toLowerCase(),
      phoneNumber: data.phoneNumber.trim(),
      location: data.location.trim(),
      specialty: data.specialty.trim(),
      createdAt: new Date().toISOString(),
    };

    // Also persist hospital profile to database / registered hospitals API
    try {
      await fetch('/api/hospitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospitalName: data.hospitalName.trim(),
          ownerName: data.ownerName.trim(),
          email: data.email.trim().toLowerCase(),
          phoneNumber: data.phoneNumber.trim(),
          location: data.location.trim(),
          specialty: data.specialty.trim(),
        }),
      });
    } catch (apiErr) {
      console.warn('API sync warning:', apiErr);
    }

    const newUser: User = {
      id: userId,
      email: data.email.trim().toLowerCase(),
      fullName: data.ownerName.trim(),
      phone: data.phoneNumber.trim(),
      role: 'HOSPITAL',
      hospitalId: 'fac-1',
      hospitalName: data.hospitalName.trim(),
      isProfileComplete: true,
      hospitalProfile,
      createdAt: new Date().toISOString(),
    };

    // Persist to database store for future logins
    try {
      await registerUserRecordAction({
        id: userId,
        email: data.email,
        password: data.password || 'password123',
        fullName: data.ownerName,
        role: 'HOSPITAL',
        phone: data.phoneNumber,
        hospitalId: 'fac-1',
        hospitalName: data.hospitalName,
        hospitalProfile,
      });
    } catch (dbErr) {
      console.warn('User DB registration warning:', dbErr);
    }

    setUser(newUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    setIsLoading(false);
    return newUser;
  };

  // 2. Role-specific signup for DOCTOR
  const signupDoctor = async (data: SignupDoctorPayload): Promise<User> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 400));

    const userId = `usr-doc-${Date.now()}`;
    const doctorProfile: DoctorProfile = {
      id: `prof-doc-${Date.now()}`,
      userId,
      doctorName: data.doctorName.trim(),
      email: data.email.trim().toLowerCase(),
      workingHospitalName: data.workingHospitalName.trim(),
      specialization: data.specialization.trim(),
      createdAt: new Date().toISOString(),
    };

    const newUser: User = {
      id: userId,
      email: data.email.trim().toLowerCase(),
      fullName: data.doctorName.trim(),
      role: 'DOCTOR',
      hospitalId: 'fac-1',
      hospitalName: data.workingHospitalName.trim(),
      occupation: `${data.specialization} Specialist`,
      isProfileComplete: true,
      doctorProfile,
      createdAt: new Date().toISOString(),
    };

    // Persist to database store for future logins
    try {
      await registerUserRecordAction({
        id: userId,
        email: data.email,
        password: data.password || 'password123',
        fullName: data.doctorName,
        role: 'DOCTOR',
        occupation: `${data.specialization} Specialist`,
        doctorProfile,
      });
    } catch (dbErr) {
      console.warn('User DB registration warning:', dbErr);
    }

    setUser(newUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    setIsLoading(false);
    return newUser;
  };

  // 3. Role-specific signup for PATIENT
  const signupPatient = async (data: SignupPatientPayload): Promise<User> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 400));

    const userId = `usr-pat-${Date.now()}`;
    const patientProfile: PatientProfile = {
      id: `prof-pat-${Date.now()}`,
      userId,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phoneNumber: data.phoneNumber?.trim(),
      createdAt: new Date().toISOString(),
    };

    const newUser: User = {
      id: userId,
      email: data.email.trim().toLowerCase(),
      fullName: data.name.trim(),
      phone: data.phoneNumber?.trim(),
      role: 'PATIENT',
      isProfileComplete: true,
      patientProfile,
      createdAt: new Date().toISOString(),
    };

    // Persist to database store for future logins
    try {
      await registerUserRecordAction({
        id: userId,
        email: data.email,
        password: data.password || 'password123',
        fullName: data.name,
        role: 'PATIENT',
        phone: data.phoneNumber,
        patientProfile,
      });
    } catch (dbErr) {
      console.warn('User DB registration warning:', dbErr);
    }

    setUser(newUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    setIsLoading(false);
    return newUser;
  };

  // General signup backward compatibility
  const signup = async (
    email: string, 
    password?: string, 
    fullName?: string, 
    role: Role | UserRole = 'PATIENT',
    hospitalId?: string
  ): Promise<User> => {
    if (role === 'HOSPITAL') {
      return signupHospital({
        hospitalName: fullName ? `${fullName}'s Medical Center` : 'Metro Community Hospital',
        ownerName: fullName || email.split('@')[0],
        email,
        phoneNumber: '+1 (555) 000-0000',
        location: 'Downtown Medical District, Metro City',
        specialty: 'General Hospital',
        password,
      });
    } else if (role === 'DOCTOR') {
      return signupDoctor({
        doctorName: fullName ? (fullName.startsWith('Dr.') ? fullName : `Dr. ${fullName}`) : 'Dr. Verified Specialist',
        email,
        workingHospitalName: 'MetroHealth Grand Medical Center',
        specialization: 'General Physician',
        password,
      });
    } else {
      return signupPatient({
        name: fullName || email.split('@')[0],
        email,
        phoneNumber: '',
        password,
      });
    }
  };

  // Authentication Login: Query DB to find existing user, verify password. Do not create new user.
  const login = async (email: string, password?: string): Promise<User> => {
    setIsLoading(true);
    try {
      const authResult = await authenticateUserAction(email, password);
      
      if (!authResult.success || !authResult.user) {
        throw new Error(authResult.error || 'Authentication failed. Please check your credentials.');
      }

      setUser(authResult.user);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authResult.user));
      return authResult.user;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: {
    fullName: string;
    age: number;
    occupation: string;
    phone?: string;
    bloodGroup?: string;
  }): Promise<User> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 400));

    if (!user) {
      throw new Error('No authenticated user found to update profile.');
    }

    const updatedUser: User = {
      ...user,
      fullName: data.fullName.trim(),
      age: data.age,
      occupation: data.occupation.trim(),
      phone: data.phone?.trim() || user.phone,
      bloodGroup: data.bloodGroup || user.bloodGroup,
      isProfileComplete: true,
    };

    setUser(updatedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    setIsLoading(false);
    return updatedUser;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const quickDemoLogin = (type: 'PATIENT_USER' | 'DOCTOR_USER' | 'HOSPITAL_USER' | 'NEW_USER') => {
    if (type === 'NEW_USER') {
      const newUser = { ...DEMO_NEW_USER, id: 'usr-new-' + Date.now() };
      setUser(newUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    } else if (type === 'DOCTOR_USER') {
      setUser(DEMO_DOCTOR_USER);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_DOCTOR_USER));
    } else if (type === 'HOSPITAL_USER') {
      setUser(DEMO_HOSPITAL_USER);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_HOSPITAL_USER));
    } else {
      setUser(DEMO_PATIENT_USER);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_PATIENT_USER));
    }
  };

  // 3-Way Hackathon Demo Role Cycle: PATIENT ➡️ DOCTOR ➡️ HOSPITAL ➡️ PATIENT
  const toggleRole = () => {
    if (!user) return;
    let nextUser: User;
    if (user.role === 'PATIENT') {
      nextUser = DEMO_DOCTOR_USER;
    } else if (user.role === 'DOCTOR') {
      nextUser = DEMO_HOSPITAL_USER;
    } else {
      nextUser = DEMO_PATIENT_USER;
    }
    
    setUser(nextUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
  };

  const setRole = (role: Role | UserRole) => {
    if (!user) return;
    if (role === 'DOCTOR') {
      setUser(DEMO_DOCTOR_USER);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_DOCTOR_USER));
    } else if (role === 'HOSPITAL' || role === 'HOSPITAL_ADMIN') {
      setUser(DEMO_HOSPITAL_USER);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_HOSPITAL_USER));
    } else {
      setUser(DEMO_PATIENT_USER);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_PATIENT_USER));
    }
  };

  const setHospitalTenant = (hospitalId: string, hospitalName: string) => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      hospitalId,
      hospitalName,
    };
    setUser(updatedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signupHospital,
        signupDoctor,
        signupPatient,
        signup,
        login,
        updateProfile,
        logout,
        quickDemoLogin,
        toggleRole,
        setRole,
        setHospitalTenant,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
