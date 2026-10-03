import { NextResponse } from 'next/server';
import { registerUserRecordAction } from '@/app/actions/auth';
import { Role, UserRole } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      email, 
      password, 
      fullName, 
      name, 
      ownerName, 
      doctorName, 
      role = 'PATIENT', 
      phone, 
      phoneNumber,
      hospitalName,
      location,
      specialty,
      specialization,
      workingHospitalName,
    } = body;

    const finalEmail = email?.trim().toLowerCase();
    const finalName = (fullName || name || ownerName || doctorName || finalEmail?.split('@')[0] || 'User').trim();
    const finalPhone = (phone || phoneNumber || '').trim();

    if (!finalEmail || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const userId = `usr-${Date.now()}`;
    let hospitalProfile;
    let doctorProfile;
    let patientProfile;

    const normalizedRole = (role as string).toUpperCase() as Role | UserRole;

    if (normalizedRole === 'HOSPITAL' || normalizedRole === 'HOSPITAL_ADMIN') {
      hospitalProfile = {
        id: `prof-hosp-${Date.now()}`,
        userId,
        hospitalName: (hospitalName || `${finalName}'s Medical Center`).trim(),
        ownerName: finalName,
        email: finalEmail,
        phoneNumber: finalPhone,
        location: (location || 'Downtown Medical District').trim(),
        specialty: (specialty || 'General Hospital').trim(),
        createdAt: new Date().toISOString(),
      };
    } else if (normalizedRole === 'DOCTOR') {
      doctorProfile = {
        id: `prof-doc-${Date.now()}`,
        userId,
        doctorName: finalName.startsWith('Dr.') ? finalName : `Dr. ${finalName}`,
        email: finalEmail,
        workingHospitalName: (workingHospitalName || hospitalName || 'MetroHealth Grand Medical Center').trim(),
        specialization: (specialization || specialty || 'General Physician').trim(),
        createdAt: new Date().toISOString(),
      };
    } else {
      patientProfile = {
        id: `prof-pat-${Date.now()}`,
        userId,
        name: finalName,
        email: finalEmail,
        phoneNumber: finalPhone,
        createdAt: new Date().toISOString(),
      };
    }

    const newUser = await registerUserRecordAction({
      id: userId,
      email: finalEmail,
      password,
      fullName: finalName,
      role: normalizedRole,
      phone: finalPhone,
      hospitalName: hospitalName || workingHospitalName,
      hospitalProfile,
      doctorProfile,
      patientProfile,
    });

    // Determine redirection route
    let redirectTo = '/patient/dashboard';
    if (normalizedRole === 'DOCTOR') {
      redirectTo = '/doctor/dashboard';
    } else if (normalizedRole === 'HOSPITAL' || normalizedRole === 'HOSPITAL_ADMIN') {
      redirectTo = '/hospital/dashboard';
    }

    const response = NextResponse.json({
      success: true,
      user: newUser,
      redirectTo,
    }, { status: 201 });

    // Set secure HTTP-only session cookie
    response.cookies.set({
      name: 'readycare_session',
      value: JSON.stringify({
        userId: newUser.id,
        role: newUser.role,
        email: newUser.email,
        createdAt: new Date().toISOString(),
      }),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
