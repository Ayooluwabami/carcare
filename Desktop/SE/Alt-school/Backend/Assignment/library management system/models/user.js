import { v4 as uuidv4 } from 'uuid';
import { getCollection } from '../config/db.js';

class User {
    constructor(name) {
        this.name = name;
        this.id = uuidv4();
        this.borrowedBooks = [];
    }

    static async findUserById(id) {
        const usersCollection = await getCollection('users');
        return usersCollection.findOne({ id });
    }

    async save() {
        const usersCollection = await getCollection('users');
        await usersCollection.insertOne(this);
    }

    static async updateUserBooks(id, books) {
        const usersCollection = await getCollection('users');
        await usersCollection.updateOne({ id }, { $set: { borrowedBooks: books } });
    }
}

export default User;
