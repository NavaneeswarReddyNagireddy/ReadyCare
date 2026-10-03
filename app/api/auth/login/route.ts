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

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Invalid credentials' },
        { status: 401 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
