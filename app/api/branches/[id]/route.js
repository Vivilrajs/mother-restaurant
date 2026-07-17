import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const db = await getDb();
    const body = await request.json();
    delete body._id;
    const result = await db.collection('branches').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    
    // Purge cached about page
    revalidatePath('/about');
    
    return NextResponse.json(result);
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function DELETE(_, { params }) {
  try {
    const { id } = await params;
    const db = await getDb();
    await db.collection('branches').deleteOne({ _id: new ObjectId(id) });
    
    // Purge cached about page
    revalidatePath('/about');
    
    return NextResponse.json({ success: true });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
