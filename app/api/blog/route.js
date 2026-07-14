import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const filter = status ? { status } : {};
    const items = await db.collection('blog_posts').find(filter).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(items);
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function POST(request) {
  try {
    const db = await getDb();
    const body = await request.json();
    const result = await db.collection('blog_posts').insertOne({ ...body, createdAt: new Date() });
    return NextResponse.json({ ...body, _id: result.insertedId }, { status: 201 });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
