import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const db = await getDb();
    const settings = await db.collection('settings').findOne({ _id: 'global' });
    return NextResponse.json(settings || {});
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function PUT(request) {
  try {
    const db = await getDb();
    const body = await request.json();
    delete body._id;
    await db.collection('settings').updateOne(
      { _id: 'global' },
      { $set: { ...body, updatedAt: new Date() } },
      { upsert: true }
    );
    
    // Purge cached paths so home page updates immediately
    revalidatePath('/');
    
    return NextResponse.json({ success: true });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
