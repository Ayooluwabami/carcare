import request from 'supertest';
import app from '../src/app';
import { expect } from 'chai';
import mongoose from 'mongoose';
import User from '../src/models/userModel'; // Import your user model
import { sign } from 'jsonwebtoken'; // Import for JWT sign

describe('Authentication API', () => {
    let userId: string;
    let token: string;

    before(async () => {
        // Connect to the test database
        await mongoose.connect(process.env.TEST_MONGODB_URI as string, { useNewUrlParser: true, useUnifiedTopology: true });

        // Create a test user for authentication
        const testUser = await User.create({
            username: 'testuser',
            password: 'password123', // Make sure to hash this in real implementation
        });

        userId = testUser._id;
    });

    after(async () => {
        // Clean up the database after tests
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    describe('POST /auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({
                    username: 'newuser',
                    password: 'password123'
                });

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('message', 'User registered successfully');
        });

        it('should not register a user with existing username', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({
                    username: 'testuser', // Existing user
                    password: 'password123'
                });

            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error', 'Username already exists');
        });
    });

    describe('POST /auth/login', () => {
        it('should login a user and return a token', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    username: 'testuser',
                    password: 'password123'
                });

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('token');
            token = res.body.token; // Store token for further tests
        });

        it('should not login with incorrect password', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    username: 'testuser',
                    password: 'wrongpassword'
                });

            expect(res.status).to.equal(401);
            expect(res.body).to.have.property('error', 'Invalid credentials');
        });
    });

    describe('GET /auth/logout', () => {
        it('should logout the user', async () => {
            const res = await request(app)
                .get('/auth/logout')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'User logged out successfully');
        });
    });

    describe('POST /auth/refresh', () => {
        it('should refresh the token', async () => {
            const res = await request(app)
                .post('/auth/refresh')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('token');
        });
    });
});
