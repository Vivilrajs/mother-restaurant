const { MongoClient } = require('mongodb');
const fs = require('fs');

for (const line of fs.readFileSync('.env.local', 'utf8').split('\n')) {
  const match = line.match(/^([A-Z_]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2];
}

const defaults = {
  menu: ['Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Beverages'],
  gallery: ['food', 'ambiance', 'events'],
  blog: ['Recipe', 'Events', 'Tips'],
};

async function run() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('mother_restaurant');
  const col = db.collection('categories');

  for (const [type, names] of Object.entries(defaults)) {
    const existingCount = await col.countDocuments({ type });
    if (existingCount > 0) {
      console.log(`Skipping ${type}: ${existingCount} categories already exist`);
      continue;
    }
    const docs = names.map(name => ({ type, name, createdAt: new Date() }));
    await col.insertMany(docs);
    console.log(`Seeded ${docs.length} ${type} categories`);
  }

  await client.close();
}

run().catch(err => { console.error(err); process.exit(1); });
