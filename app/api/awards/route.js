import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDb();
    let items = await db.collection('awards').find({}).sort({ createdAt: 1 }).toArray();
    if (items.length === 0) {
      const now = new Date();
      const DEFAULT_AWARDS = [
        { icon: 'fa-star', title: 'UAE Excellence', text: 'Best Family Restaurant 2024', image: '', createdAt: now },
        { icon: 'fa-trophy', title: 'Dubai Food Festival', text: 'Outstanding Chef 2023', image: '', createdAt: now },
        { icon: 'fa-medal', title: "Gulf's 50 Best", text: 'Ranked #8 in 2024', image: '', createdAt: now },
        { icon: 'fa-certificate', title: 'HACCP Certified', text: 'Food Safety Excellence', image: '', createdAt: now },
      ];
      await db.collection('awards').insertMany(DEFAULT_AWARDS);
      items = await db.collection('awards').find({}).sort({ createdAt: 1 }).toArray();
    }
    return NextResponse.json(items);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const db = await getDb();
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    const item = { ...body, createdAt: new Date() };
    const result = await db.collection('awards').insertOne(item);
    return NextResponse.json({ ...item, _id: result.insertedId }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
