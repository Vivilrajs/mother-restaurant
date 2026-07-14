const { MongoClient } = require('mongodb');
const uri = 'mongodb://justinkj765_db_user:4jVmTNErsLeuBiiZ@ac-4fcl6qp-shard-00-00.cpjynnd.mongodb.net:27017,ac-4fcl6qp-shard-00-01.cpjynnd.mongodb.net:27017,ac-4fcl6qp-shard-00-02.cpjynnd.mongodb.net:27017/mother_restaurant?ssl=true&replicaSet=atlas-14js3b-shard-0&authSource=admin';
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
async function run() {
  try {
    console.log('Connecting via replica set...');
    await client.connect();
    console.log('Connected successfully via replica set!');
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
