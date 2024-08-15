import { Router } from 'express';
import Library from '../models/library.js';

const router = Router();
const library = new Library();

router.get('/:isbn', async (req, res) => {
    const { isbn } = req.params;
    const book = await library.getBookInfo(isbn);
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).send('Book not found');
    }
});

export default router;
