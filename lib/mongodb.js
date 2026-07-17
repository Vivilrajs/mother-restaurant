import { MongoClient } from 'mongodb';

let uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Please add MONGODB_URI to .env.local');

// Fallback to direct replica set URI to bypass local ISP DNS SRV resolution issues
if (uri.includes('mongodb+srv://') && uri.includes('mother-restaurant.cpjynnd.mongodb.net')) {
  uri = 'mongodb://justinkj765_db_user:4jVmTNErsLeuBiiZ@ac-4fcl6qp-shard-00-00.cpjynnd.mongodb.net:27017,ac-4fcl6qp-shard-00-01.cpjynnd.mongodb.net:27017,ac-4fcl6qp-shard-00-02.cpjynnd.mongodb.net:27017/mother_restaurant?ssl=true&replicaSet=atlas-14js3b-shard-0&authSource=admin';
}

const options = { serverSelectionTimeoutMS: 5000 };

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDb() {
  const client = await clientPromise;
  return client.db('mother_restaurant');
}
