import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { deleteByUrl } from '@/lib/s3';

export async function DELETE(_, { params }) {
  try {
    const { id } = await params;
    const db = await getDb();
    const existing = await db.collection('gallery').findOne({ _id: new ObjectId(id) });
    await db.collection('gallery').deleteOne({ _id: new ObjectId(id) });
    if (existing?.url) await deleteByUrl(existing.url);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
