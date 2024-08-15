import { Router } from 'express';
import Library from '../models/library.js';
import User from '../models/user.js';

const router = Router();
const library = new Library();

router.post('/borrow', async (req, res) => {
    const { userId, isbn } = req.body;
    const user = library.members.find(member => member.id === userId);

    if (user && await library.borrowBook(user, isbn)) {
        res.status(200).send('Book borrowed successfully');
    } else {
        res.status(400).send('Failed to borrow book');
    }
});

router.post('/return', async (req, res) => {
    const { userId, isbn } = req.body;
    const user = library.members.find(member => member.id === userId);

    if (user && await library.returnBook(user, isbn)) {
        res.status(200).send('Book returned successfully');
    } else {
        res.status(400).send('Failed to return book');
    }
});

export default router;
