import { getDB } from '../config/db.js';

const insertDocument = async (collectionName, document) => {
    const db = getDB();
    return await db.collection(collectionName).insertOne(document);
};

const findDocument = async (collectionName, query) => {
    const db = getDB();
    return await db.collection(collectionName).findOne(query);
};

const updateDocument = async (collectionName, query, update) => {
    const db = getDB();
    return await db.collection(collectionName).updateOne(query, update);
};

const deleteDocument = async (collectionName, query) => {
    const db = getDB();
    return await db.collection(collectionName).deleteOne(query);
};

export { insertDocument, findDocument, updateDocument, deleteDocument };
