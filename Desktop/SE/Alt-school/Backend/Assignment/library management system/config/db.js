import { MongoClient } from 'mongodb';

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'libraryManagementSystem';
let db;

export const connectDB = async () => {
    const client = new MongoClient(url);
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB');
};

export const getCollection = (collectionName) => {
    return db.collection(collectionName);
};
