import request from 'supertest';
import app from '../src/app';
import { expect } from 'chai';
import mongoose from 'mongoose';
import Service from '../src/models/serviceModel';
import User from '../src/models/userModel';

describe('Service API', () => {
    let serviceId: string;
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

        // Create a test service
        const service = await Service.create({
            name: 'Oil Change',
            description: 'Full oil change service for vehicles.',
            price: 50,
            userId: userId,
        });

        serviceId = service._id;
    });

    after(async () => {
        // Clean up the database after tests
        await Service.deleteMany({});
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    describe('GET /services/:id', () => {
        it('should return service details', async () => {
            const res = await request(app)
                .get(`/services/${serviceId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('name', 'Oil Change');
        });

        it('should return 404 for non-existing service', async () => {
            const res = await request(app)
                .get('/services/60b6c56e46f4904d5c8e4e99') // An example of a non-existing service ID
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('error', 'Service not found');
        });
    });

    describe('PUT /services/:id', () => {
        it('should update service details', async () => {
            const res = await request(app)
                .put(`/services/${serviceId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Premium Oil Change',
                    description: 'Full oil change service with premium oil.',
                    price: 75,
                });

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'Service updated successfully');
        });

        it('should return 400 for invalid updates', async () => {
            const res = await request(app)
                .put(`/services/${serviceId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: '', // Invalid name
                });

            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error', 'Invalid name');
        });
    });

    describe('DELETE /services/:id', () => {
        it('should delete the service', async () => {
            const res = await request(app)
                .delete(`/services/${serviceId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'Service deleted successfully');
        });

        it('should return 404 for non-existing service deletion', async () => {
            const res = await request(app)
                .delete(`/services/${serviceId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('error', 'Service not found');
        });
    });
});
