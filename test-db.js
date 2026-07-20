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
    console.log('Connecting...');
    await client.connect();
    console.log('Connected successfully!');
    const db = client.db('mother_restaurant');
    const cols = await db.listCollections().toArray();
    console.log('Collections:', cols.map(c => c.name));
  } catch (err) {
    console.error('Error connecting:', err);
  } finally {
    await client.close();
  }
}
run();
