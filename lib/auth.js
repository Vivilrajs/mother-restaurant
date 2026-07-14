import { cookies } from 'next/headers';

const SECRET = process.env.SESSION_SECRET || 'mother-restaurant-secret-2025';
const COOKIE_NAME = 'mother_admin_session';

function sign(value) {
  let hash = 5381;
  const combined = value + SECRET;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash * 33) ^ combined.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

export function createSession(username) {
  const data = JSON.stringify({ username, ts: Date.now() });
  const encoded = btoa(data);
  const sig = sign(encoded);
  return `${encoded}.${sig}`;
}

export function verifySession(token) {
  if (!token) return null;
  const [encoded, sig] = token.split('.');
  if (!encoded || !sig) return null;
  if (sign(encoded) !== sig) return null;
  try {
    return JSON.parse(atob(encoded));
  } catch {
    return null;
  }
}

export function getSessionFromCookies() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifySession(token);
}

export { COOKIE_NAME };
