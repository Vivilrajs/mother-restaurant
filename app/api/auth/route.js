import { NextResponse } from 'next/server';
import { createSession, COOKIE_NAME } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { createHash } from 'crypto';

function hashPassword(password) {
  return createHash('sha256').update(password).digest('hex');
}

export async function POST(request) {
  const { username, password } = await request.json();
  try {
    const db = await getDb();
    const admin = await db.collection('admins').findOne({
      $or: [
        { username: username },
        { username: username.includes('@') ? username : `${username}@themother.ae` }
      ],
      password: hashPassword(password)
    });

    if (admin) {
      const token = createSession(username);
      const response = NextResponse.json({ success: true });
      response.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
      return response;
    }
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
