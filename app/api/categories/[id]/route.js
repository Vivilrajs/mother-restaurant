import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(_, { params }) {
  try {
    const { id } = await params;
    const db = await getDb();
    await db.collection('categories').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
