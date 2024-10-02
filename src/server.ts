import app from './app';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, (err?: Error) => {
    if (err) {
        console.error('Error starting the server:', err);
        process.exit(1); // Exit with failure if there’s an error
    }
    console.log(`Server is running on http://localhost:${PORT}`);
});
