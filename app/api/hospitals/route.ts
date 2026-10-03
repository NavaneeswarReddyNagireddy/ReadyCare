import { NextResponse } from 'next/server';
import { getRegisteredHospitalProfiles, registerHospitalAction } from '@/app/actions/hospital';

export async function GET() {
  try {
    const hospitals = await getRegisteredHospitalProfiles();
    return NextResponse.json({ success: true, data: hospitals });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch hospital profiles' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { hospitalName, ownerName, email, phoneNumber, location, specialty } = body;

    if (!hospitalName || !ownerName || !email || !phoneNumber || !location || !specialty) {
      return NextResponse.json(
        { success: false, error: 'Missing required hospital fields' },
        { status: 400 }
      );
    }

    const newHospital = await registerHospitalAction({
      hospitalName,
      ownerName,
      email,
      phoneNumber,
      location,
      specialty,
    });

    return NextResponse.json({ success: true, data: newHospital }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to register hospital' },
      { status: 500 }
    );
  }
}
