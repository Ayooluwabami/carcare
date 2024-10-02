import request from 'supertest';
import app from '../src/app';
import { expect } from 'chai';
import mongoose from 'mongoose';
import User from '../src/models/userModel';

describe('User API', () => {
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

        // Log in the user to obtain a token
        const res = await request(app)
            .post('/auth/login')
            .send({
                username: 'testuser',
                password: 'password123'
            });
        token = res.body.token;
    });

    after(async () => {
        // Clean up the database after tests
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    describe('GET /users/:id', () => {
        it('should return user details', async () => {
            const res = await request(app)
                .get(`/users/${userId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('username', 'testuser');
        });

        it('should return 404 for non-existing user', async () => {
            const res = await request(app)
                .get('/users/60b6c56e46f4904d5c8e4e99') // An example of a non-existing user ID
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('error', 'User not found');
        });
    });

    describe('PUT /users/:id', () => {
        it('should update user details', async () => {
            const res = await request(app)
                .put(`/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    username: 'updateduser'
                });

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'User updated successfully');
        });

        it('should return 400 for invalid updates', async () => {
            const res = await request(app)
                .put(`/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    username: '' // Invalid username
                });

            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error', 'Invalid username');
        });
    });

    describe('DELETE /users/:id', () => {
        it('should delete the user', async () => {
            const res = await request(app)
                .delete(`/users/${userId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'User deleted successfully');
        });

        it('should return 404 for non-existing user deletion', async () => {
            const res = await request(app)
                .delete(`/users/${userId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('error', 'User not found');
        });
    });
});
