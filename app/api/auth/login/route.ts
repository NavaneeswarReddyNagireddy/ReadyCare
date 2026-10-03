import { NextResponse } from 'next/server';
import { authenticateUserAction } from '@/app/actions/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await authenticateUserAction(email, password);

    if (!result.success || !result.user) {
      return NextResponse.json(
        { success: false, error: result.error || 'Invalid email or password' },
        { status: 401 }
      );
    }

    const response = NextResponse.json(result, { status: 200 });

    // Set secure HTTP-only session cookie
    response.cookies.set({
      name: 'readycare_session',
      value: JSON.stringify({
        userId: result.user.id,
        role: result.user.role,
        email: result.user.email,
        createdAt: new Date().toISOString(),
      }),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
