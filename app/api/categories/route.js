import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

const VALID_TYPES = ['menu', 'gallery', 'blog'];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: 'Invalid or missing type' }, { status: 400 });
    }
    const db = await getDb();
    const items = await db.collection('categories').find({ type }).sort({ name: 1 }).toArray();
    return NextResponse.json(items);
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function POST(request) {
  try {
    const db = await getDb();
    const body = await request.json();
    const { type, name } = body;
    if (!VALID_TYPES.includes(type) || !name?.trim()) {
      return NextResponse.json({ error: 'type and name are required' }, { status: 400 });
    }
    const trimmed = name.trim();
    const existing = await db.collection('categories').findOne({ type, name: { $regex: `^${trimmed}$`, $options: 'i' } });
    if (existing) {
      return NextResponse.json(existing, { status: 200 });
    }
    const result = await db.collection('categories').insertOne({ type, name: trimmed, createdAt: new Date() });
    return NextResponse.json({ _id: result.insertedId, type, name: trimmed }, { status: 201 });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
