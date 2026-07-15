import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const db = await getDb();
    const body = await request.json();
    if (!body.name || !body.email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }
    const result = await db.collection('catering_requests').insertOne({ ...body, createdAt: new Date() });
    return NextResponse.json({ _id: result.insertedId }, { status: 201 });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
