import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || '';

// Start the server
app.listen(PORT, (err?: Error) => {
    if (err) {
        console.error('Error starting the server:', err);
        process.exit(1); // Exit with failure if there’s an error
    }
    console.log(`Server is running on http://localhost:${PORT}`);
});
