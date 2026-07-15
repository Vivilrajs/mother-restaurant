import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { deleteByUrl } from '@/lib/s3';

export async function GET(_, { params }) {
  try {
    const { id } = await params;
    const db = await getDb();
    const item = await db.collection('blog_posts').findOne({ _id: new ObjectId(id) });
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(item);
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const db = await getDb();
    const body = await request.json();
    delete body._id;
    const existing = await db.collection('blog_posts').findOne({ _id: new ObjectId(id) });
    const result = await db.collection('blog_posts').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (existing?.featuredImage && body.featuredImage !== existing.featuredImage) {
      await deleteByUrl(existing.featuredImage);
    }
    return NextResponse.json(result);
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function DELETE(_, { params }) {
  try {
    const { id } = await params;
    const db = await getDb();
    const existing = await db.collection('blog_posts').findOne({ _id: new ObjectId(id) });
    await db.collection('blog_posts').deleteOne({ _id: new ObjectId(id) });
    if (existing?.featuredImage) await deleteByUrl(existing.featuredImage);
    return NextResponse.json({ success: true });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
