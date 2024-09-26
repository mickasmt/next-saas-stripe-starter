import { NextResponse } from 'next/server';
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}