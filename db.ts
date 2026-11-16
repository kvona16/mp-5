// db.ts (at the root of your project)
import { MongoClient, Db } from "mongodb";

const URI = process.env.MONGO_URI as string;
const DB_NAME = "url_shortener";

if (!URI) {
    throw new Error("Please define the MONGO_URI environment variable inside .env.local");
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export default async function getCollection(collectionName: string) {
    if (cachedDb) {
        return cachedDb.collection(collectionName);
    }

    if (!cachedClient) {
        cachedClient = new MongoClient(URI);
        await cachedClient.connect();
    }

    cachedDb = cachedClient.db(DB_NAME);
    return cachedDb.collection(collectionName);
}