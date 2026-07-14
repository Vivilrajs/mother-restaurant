import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const date = searchParams.get('date');
    const filter = {};
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
    if (date) filter.date = date;
    const items = await db.collection('reservations').find(filter).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(items);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const db = await getDb();
    const body = await request.json();
    const item = { ...body, status: 'pending', createdAt: new Date() };
    const result = await db.collection('reservations').insertOne(item);
    return NextResponse.json({ ...item, _id: result.insertedId }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
