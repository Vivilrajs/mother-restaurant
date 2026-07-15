import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDb();
    const items = await db.collection('job_listings').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(items);
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function POST(request) {
  try {
    const db = await getDb();
    const body = await request.json();
    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    const result = await db.collection('job_listings').insertOne({ ...body, createdAt: new Date() });
    return NextResponse.json({ ...body, _id: result.insertedId }, { status: 201 });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
