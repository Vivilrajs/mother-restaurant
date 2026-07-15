import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { mkdir, writeFile, unlink } from 'fs/promises';
import path from 'path';

const REGION = process.env.AWS_REGION;
const BUCKET = process.env.AWS_S3_BUCKET;
let warnedMockMode = false;

let client;
function getClient() {
  if (!client) {
    client = new S3Client({
      region: REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  return client;
}

function publicUrl(key) {
  const base = process.env.AWS_S3_PUBLIC_BASE_URL;
  if (base) return `${base.replace(/\/$/, '')}/${key}`;
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
}

function sanitizeName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-80);
}

// Local-disk mock used only when AWS isn't configured yet, so upload UX can be
// tested end-to-end before real S3 credentials are added. Swaps to real S3
// automatically once AWS_REGION and AWS_S3_BUCKET are set — no code change needed.
// Not suitable for production: writes to public/uploads at request time, which
// won't persist on ephemeral/serverless deployments.
async function uploadMock({ buffer, filename, folder }) {
  if (!warnedMockMode) {
    console.warn('[uploads] AWS_REGION/AWS_S3_BUCKET not set — saving to public/uploads (local mock). Add real AWS credentials to .env.local to use S3.');
    warnedMockMode = true;
  }
  const key = `${folder}/${Date.now()}-${randomUUID().slice(0, 8)}-${sanitizeName(filename)}`;
  const filePath = path.join(process.cwd(), 'public', 'uploads', key);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, buffer);
  return { key, url: `/uploads/${key}` };
}

export async function uploadToS3({ buffer, contentType, filename, folder }) {
  if (!BUCKET || !REGION) {
    return uploadMock({ buffer, filename, folder });
  }
  const key = `${folder}/${Date.now()}-${randomUUID().slice(0, 8)}-${sanitizeName(filename)}`;
  await getClient().send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }));
  return { key, url: publicUrl(key) };
}

// Derives the storage key back out of a URL previously returned by uploadToS3,
// so a DB-stored URL is enough to delete the underlying file later.
// Returns null for anything we didn't upload (external/seed stock URLs) —
// those must never be deleted.
function keyFromUrl(url) {
  if (!url) return null;
  if (url.startsWith('/uploads/')) return { mock: true, key: url.slice('/uploads/'.length) };
  const base = process.env.AWS_S3_PUBLIC_BASE_URL;
  if (base && url.startsWith(base.replace(/\/$/, '') + '/')) {
    return { mock: false, key: url.slice(base.replace(/\/$/, '').length + 1) };
  }
  const s3Prefix = `https://${BUCKET}.s3.${REGION}.amazonaws.com/`;
  if (BUCKET && REGION && url.startsWith(s3Prefix)) {
    return { mock: false, key: url.slice(s3Prefix.length) };
  }
  return null;
}

export async function deleteByUrl(url) {
  const parsed = keyFromUrl(url);
  if (!parsed) return;
  try {
    if (parsed.mock) {
      await unlink(path.join(process.cwd(), 'public', 'uploads', parsed.key));
    } else {
      await getClient().send(new DeleteObjectCommand({ Bucket: BUCKET, Key: parsed.key }));
    }
  } catch (e) {
    // Missing file/object is fine (already gone); log anything else without blocking the caller.
    if (e.code !== 'ENOENT') console.error('[uploads] failed to delete', url, e.message);
  }
}
