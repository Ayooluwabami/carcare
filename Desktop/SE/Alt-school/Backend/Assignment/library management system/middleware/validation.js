const validateBorrowRequest = (req, res, next) => {
    const { userId, isbn } = req.body;
    if (!userId || !isbn) {
        return res.status(400).send('Missing userId or isbn');
    }
    next();
};

export default validateBorrowRequest;
