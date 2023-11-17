import { MongoClient } from 'mongodb';

const url = process.env.MONGO_URL;
const client = new MongoClient(url ?? 'mongodb://localhost:27017');

export const db = client.db('anigram');
export const subscriptionsCollection = db.collection<{ subscribers: string[], search: string, nextEpisode: string }>('subscriptions');

async function main() {
  await client.connect();
  return 'db connected...';
}

export const initDB = () => main()
  .then(console.log)
  .catch(console.error)
