import { ObjectId } from 'mongodb';
import { getCollection } from '../config/db.js';
import Book from './book.js';
import User from './user.js';

class Library {
    constructor() {
        this.books = [];
        this.members = [];
    }

    async addNewBook(book) {
        const booksCollection = await getCollection('books');
        await booksCollection.insertOne(book);
        this.books.push(book);
    }

    async registerMember(user) {
        const usersCollection = await getCollection('users');
        await usersCollection.insertOne(user);
        this.members.push(user);
    }

    async borrowBook(user, isbn) {
        const book = this.books.find(b => b.isbn === isbn);
        if (!book || book.borrowed) {
            return false;
        }
        if (user.borrowedBooks.length >= 3) {
            return false;
        }
        book.borrowed = true;
        user.borrowedBooks.push(book);
        await User.updateUserBooks(user.id, user.borrowedBooks);
        return true;
    }

    async returnBook(user, isbn) {
        const bookIndex = user.borrowedBooks.findIndex(b => b.isbn === isbn);
        if (bookIndex === -1) {
            return false;
        }
        const book = user.borrowedBooks[bookIndex];
        book.borrowed = false;
        user.borrowedBooks.splice(bookIndex, 1);
        await User.updateUserBooks(user.id, user.borrowedBooks);
        return true;
    }

    async getBookInfo(isbn) {
        const book = this.books.find(b => b.isbn === isbn);
        return book;
    }
}

export default Library;
