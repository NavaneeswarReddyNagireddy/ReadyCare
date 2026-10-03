'use server';

import prisma, { UserRecord } from '@/lib/prisma';
import { User, Role, UserRole, HospitalProfile, DoctorProfile, PatientProfile } from '@/types';
import { hashPassword, verifyPassword } from '@/lib/auth';

export interface LoginResult {
  success: boolean;
  user?: User;
  error?: string;
  redirectTo?: string;
}

/**
 * Server Action: Authenticates a returning user against existing database records.
 * Will NEVER create a new user on login.
 */
export async function authenticateUserAction(
  email: string,
  password?: string
): Promise<LoginResult> {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    return {
      success: false,
      error: 'Please enter your email address.',
    };
  }

  if (!password) {
    return {
      success: false,
      error: 'Please enter your password.',
    };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!existingUser) {
      return {
        success: false,
        error: 'No account found with this email. Please check your credentials or register for an account.',
      };
    }

    // Verify password securely using bcrypt with fallback for demo accounts
    const isPasswordValid = await verifyPassword(password, existingUser.password);
    if (!isPasswordValid) {
      return {
        success: false,
        error: 'Invalid password. Please check your password and try again.',
      };
    }

    // Determine redirect path based strictly on Role
    let redirectTo = '/patient/dashboard';
    if (existingUser.role === 'DOCTOR') {
      redirectTo = '/doctor/dashboard';
    } else if (existingUser.role === 'HOSPITAL' || existingUser.role === 'HOSPITAL_ADMIN') {
      redirectTo = '/hospital/dashboard';
    } else {
      redirectTo = '/patient/dashboard';
    }

    const safeUser: User = {
      id: existingUser.id,
      email: existingUser.email,
      fullName: existingUser.fullName,
      role: existingUser.role,
      phone: existingUser.phone,
      hospitalId: existingUser.hospitalId,
      hospitalName: existingUser.hospitalName,
      occupation: existingUser.occupation,
      bloodGroup: existingUser.bloodGroup,
      age: existingUser.age,
      avatarUrl: existingUser.avatarUrl,
      isProfileComplete: existingUser.isProfileComplete,
      hospitalProfile: existingUser.hospitalProfile,
      doctorProfile: existingUser.doctorProfile,
      patientProfile: existingUser.patientProfile,
      createdAt: existingUser.createdAt,
    };

    return {
      success: true,
      user: safeUser,
      redirectTo,
    };
  } catch (err: any) {
    console.error('Login action error:', err);
    return {
      success: false,
      error: err?.message || 'Authentication error. Please try again.',
    };
  }
}

/**
 * Server Action: Registers a new user into the database store for future logins.
 */
export async function registerUserRecordAction(data: {
  id?: string;
  email: string;
  password?: string;
  fullName: string;
  role: Role | UserRole;
  phone?: string;
  hospitalId?: string;
  hospitalName?: string;
  occupation?: string;
  hospitalProfile?: HospitalProfile;
  doctorProfile?: DoctorProfile;
  patientProfile?: PatientProfile;
}): Promise<User> {
  const rawPassword = data.password?.trim() || 'password123';
  // Check if rawPassword is already a bcrypt hash
  const isAlreadyHashed = /^\$2[abyx]?\$\d+\$/.test(rawPassword);
  const hashedPassword = isAlreadyHashed ? rawPassword : await hashPassword(rawPassword);

  const created = await prisma.user.create({
    data: {
      id: data.id || `usr-${Date.now()}`,
      email: data.email.trim().toLowerCase(),
      fullName: data.fullName.trim(),
      password: hashedPassword,
      role: data.role,
      phone: data.phone?.trim(),
      hospitalId: data.hospitalId,
      hospitalName: data.hospitalName,
      occupation: data.occupation,
      hospitalProfile: data.hospitalProfile,
      doctorProfile: data.doctorProfile,
      patientProfile: data.patientProfile,
      isProfileComplete: true,
    },
  });

  return {
    id: created.id,
    email: created.email,
    fullName: created.fullName,
    role: created.role,
    phone: created.phone,
    hospitalId: created.hospitalId,
    hospitalName: created.hospitalName,
    occupation: created.occupation,
    bloodGroup: created.bloodGroup,
    age: created.age,
    avatarUrl: created.avatarUrl,
    isProfileComplete: created.isProfileComplete,
    hospitalProfile: created.hospitalProfile,
    doctorProfile: created.doctorProfile,
    patientProfile: created.patientProfile,
    createdAt: created.createdAt,
  };
}
