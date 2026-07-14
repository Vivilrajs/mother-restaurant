const { MongoClient } = require('mongodb');
const uri = 'mongodb://justinkj765_db_user:4jVmTNErsLeuBiiZ@ac-4fcl6qp-shard-00-00.cpjynnd.mongodb.net:27017,ac-4fcl6qp-shard-00-01.cpjynnd.mongodb.net:27017,ac-4fcl6qp-shard-00-02.cpjynnd.mongodb.net:27017/mother_restaurant?ssl=true&replicaSet=atlas-14js3b-shard-0&authSource=admin';
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
