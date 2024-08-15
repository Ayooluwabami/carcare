import express from 'express';
import bookRoutes from './routes/bookRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { connectDB } from './config/db.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/books', bookRoutes);
app.use('/users', userRoutes);

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

startServer();
