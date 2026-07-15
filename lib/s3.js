import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
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
