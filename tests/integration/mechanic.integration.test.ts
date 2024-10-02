import request from 'supertest';
import app from '../src/app';
import { expect } from 'chai';
import mongoose from 'mongoose';
import Mechanic from '../src/models/mechanicModel';
import User from '../src/models/userModel';

describe('Mechanic API', () => {
    let mechanicId: string;
    let token: string;
    let userId: string;

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

        // Create a test mechanic
        const mechanic = await Mechanic.create({
            name: 'Test Mechanic',
            userId: userId,
            specialty: 'General Repair',
            experience: 5,
        });

        mechanicId = mechanic._id;
    });

    after(async () => {
        // Clean up the database after tests
        await Mechanic.deleteMany({});
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    describe('GET /mechanics/:id', () => {
        it('should return mechanic details', async () => {
            const res = await request(app)
                .get(`/mechanics/${mechanicId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('name', 'Test Mechanic');
        });

        it('should return 404 for non-existing mechanic', async () => {
            const res = await request(app)
                .get('/mechanics/60b6c56e46f4904d5c8e4e99') // An example of a non-existing mechanic ID
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('error', 'Mechanic not found');
        });
    });

    describe('PUT /mechanics/:id', () => {
        it('should update mechanic details', async () => {
            const res = await request(app)
                .put(`/mechanics/${mechanicId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Updated Mechanic',
                    specialty: 'Electrical Repair',
                    experience: 6,
                });

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'Mechanic updated successfully');
        });

        it('should return 400 for invalid updates', async () => {
            const res = await request(app)
                .put(`/mechanics/${mechanicId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: '', // Invalid name
                });

            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error', 'Invalid name');
        });
    });

    describe('DELETE /mechanics/:id', () => {
        it('should delete the mechanic', async () => {
            const res = await request(app)
                .delete(`/mechanics/${mechanicId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'Mechanic deleted successfully');
        });

        it('should return 404 for non-existing mechanic deletion', async () => {
            const res = await request(app)
                .delete(`/mechanics/${mechanicId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('error', 'Mechanic not found');
        });
    });
});
