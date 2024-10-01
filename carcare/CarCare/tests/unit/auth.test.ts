import request from 'supertest';
import app from '../src/app';
import { expect } from 'chai';
import mongoose from 'mongoose';
import User from '../src/models/userModel'; // Import your user model

describe('Authentication API', () => {
    before(async () => {
        // Connect to the test database
        await mongoose.connect(process.env.TEST_MONGODB_URI as string, { useNewUrlParser: true, useUnifiedTopology: true });
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
                    username: 'testuser',
                    password: 'Password123!',
                });

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('message', 'User registered successfully');
            expect(res.body).to.have.property('user');
        });

        it('should not register a user with existing username', async () => {
            await request(app)
                .post('/auth/register')
                .send({
                    username: 'testuser',
                    password: 'Password123!',
                });

            const res = await request(app)
                .post('/auth/register')
                .send({
                    username: 'testuser',
                    password: 'Password123!',
                });

            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error', 'Username already exists');
        });
    });

    describe('POST /auth/login', () => {
        it('should login an existing user', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    username: 'testuser',
                    password: 'Password123!',
                });

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('token'); // Expect a token to be returned
        });

        it('should not login with invalid credentials', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    username: 'wronguser',
                    password: 'WrongPassword!',
                });

            expect(res.status).to.equal(401);
            expect(res.body).to.have.property('error', 'Invalid username or password');
        });
    });
});
