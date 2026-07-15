import { NextResponse } from 'next/server';
import { verifySession, COOKIE_NAME } from '@/lib/auth';
import { uploadToS3 } from '@/lib/s3';

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'video/mp4', 'video/webm', 'video/quicktime'
];
const MAX_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_FOLDERS = ['menu', 'chefs', 'gallery', 'blog', 'banners'];

export async function POST(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!verifySession(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const folderRaw = formData.get('folder');
    const folder = ALLOWED_FOLDERS.includes(folderRaw) ? folderRaw : 'uploads';
    const files = formData.getAll('files').filter((f) => typeof f === 'object' && 'arrayBuffer' in f);

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploaded = [];
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: `Unsupported file type: ${file.type || 'unknown'}` }, { status: 400 });
      }
      if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: `${file.name} exceeds the 5MB limit` }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const { url, key } = await uploadToS3({
        buffer,
        contentType: file.type,
        filename: file.name || 'upload',
        folder,
      });
      uploaded.push({ url, key });
    }

    return NextResponse.json({ files: uploaded }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
