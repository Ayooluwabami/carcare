import request from 'supertest';
import app from '../src/app';
import { expect } from 'chai';
import mongoose from 'mongoose';
import User from '../src/models/userModel'; // Import your user model
import { sign } from 'jsonwebtoken'; // Import for JWT sign

describe('User API', () => {
    let token: string;
    let userId: string;

    before(async () => {
        // Connect to the test database
        await mongoose.connect(process.env.TEST_MONGODB_URI as string, { useNewUrlParser: true, useUnifiedTopology: true });

        // Create a test user for authentication
        const testUser = await User.create({
            username: 'testuser',
            password: 'Password123!', // Make sure to hash the password if your model requires it
        });

        userId = testUser._id;

        // Generate a token for the test user
        token = sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    });

    after(async () => {
        // Clean up the database after tests
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    describe('GET /user/:id', () => {
        it('should fetch user details by ID', async () => {
            const res = await request(app)
                .get(`/user/${userId}`)
                .set('Authorization', `Bearer ${token}`); // Set the token in the authorization header

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('username', 'testuser');
            expect(res.body).to.have.property('_id', userId.toString());
        });

        it('should return 404 for non-existing user ID', async () => {
            const res = await request(app)
                .get('/user/invalidUserId')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('error', 'User not found');
        });
    });

    describe('PUT /user/:id', () => {
        it('should update user details', async () => {
            const res = await request(app)
                .put(`/user/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ username: 'updatedUser' });

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'User updated successfully');

            // Verify the update
            const updatedUser = await User.findById(userId);
            expect(updatedUser?.username).to.equal('updatedUser');
        });

        it('should return 404 for non-existing user ID on update', async () => {
            const res = await request(app)
                .put('/user/invalidUserId')
                .set('Authorization', `Bearer ${token}`)
                .send({ username: 'anotherUpdate' });

            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('error', 'User not found');
        });
    });
});
