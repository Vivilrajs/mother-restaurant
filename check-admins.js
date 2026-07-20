const { MongoClient } = require('mongodb');
const fs = require('fs');

for (const line of fs.readFileSync('.env.local', 'utf8').split('\n')) {
  const match = line.match(/^([A-Z_]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2];
}

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Please add MONGODB_URI to .env.local');

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
async function run() {
  try {
    await client.connect();
    const db = client.db('mother_restaurant');
    const admins = await db.collection('admins').find({}).toArray();
    console.log('Admins in DB:', admins);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
run();
