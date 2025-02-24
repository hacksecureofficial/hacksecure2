import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';

interface User {
  email: string;
  vip_subscription: boolean;
}

export const dynamic = 'force-dynamic'; // Force dynamic rendering to avoid static generation issues

export async function GET() {
  try {
    const cookieStore = cookies();
    const userEmail = cookieStore.get('userEmail')?.value;

    if (!userEmail) {
      return NextResponse.json({ 
        vip_subscription: false, 
        message: 'User not logged in' 
      }, { status: 401 });
    }

    const filePath = path.resolve(process.cwd(), 'data', 'users.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const users: User[] = JSON.parse(fileContents);

    const currentUser = users.find((user) => user.email === userEmail);

    if (!currentUser) {
      return NextResponse.json({ 
        vip_subscription: false, 
        message: 'User not found' 
      }, { status: 404 });
    }

    return NextResponse.json({
      vip_subscription: currentUser.vip_subscription,
      message: currentUser.vip_subscription 
        ? 'VIP subscription is active' 
        : 'No active VIP subscription',
    });
  } catch (error) {
    console.error('Error checking subscription:', error);
    return NextResponse.json({ 
      error: 'Failed to check subscription status' 
    }, { status: 500 });
  }
}
