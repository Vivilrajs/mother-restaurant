const { MongoClient } = require('mongodb');
const fs = require('fs');

for (const line of fs.readFileSync('.env.local', 'utf8').split('\n')) {
  const match = line.match(/^([A-Z_]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2];
}

const defaults = [
  { question: 'What are your opening hours?', answer: 'Monday - Thursday: 12:00 PM - 11:00 PM\nFriday - Saturday: 12:00 PM - 12:00 AM\nSunday: 12:00 PM - 10:00 PM' },
  { question: 'Do you accept reservations?', answer: 'Yes, we highly recommend reservations. You can book online, by phone, or through WhatsApp. For parties of 8+, please call us directly.' },
  { question: 'Is there a dress code?', answer: 'Smart casual is recommended. We kindly ask that guests avoid sportswear, flip-flops, and overly casual attire.' },
  { question: 'Do you accommodate dietary restrictions?', answer: 'Absolutely. We cater to vegetarian, vegan, gluten-free, halal, and other dietary requirements. Please inform us when booking.' },
  { question: 'Is parking available?', answer: 'Yes, we offer complimentary valet parking for all our guests at our branches.' },
  { question: 'Do you offer private dining?', answer: 'Yes, we have several private dining rooms available for groups of 8-50 guests. Contact us for details and availability.' },
];

async function run() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('mother_restaurant');
  const col = db.collection('faqs');

  const existingCount = await col.countDocuments({});
  if (existingCount > 0) {
    console.log(`Skipping: ${existingCount} FAQs already exist`);
  } else {
    const now = new Date();
    await col.insertMany(defaults.map(d => ({ ...d, createdAt: now })));
    console.log(`Seeded ${defaults.length} FAQs`);
  }

  await client.close();
}

run().catch(err => { console.error(err); process.exit(1); });
