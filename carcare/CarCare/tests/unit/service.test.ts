import request from 'supertest';
import app from '../src/app';
import { expect } from 'chai';
import mongoose from 'mongoose';
import Service from '../src/models/serviceModel'; // Import your service model
import { sign } from 'jsonwebtoken'; // Import for JWT sign

describe('Service API', () => {
    let token: string;
    let serviceId: string;

    before(async () => {
        // Connect to the test database
        await mongoose.connect(process.env.TEST_MONGODB_URI as string, { useNewUrlParser: true, useUnifiedTopology: true });

        // Create a test user for authentication
        const testService = await Service.create({
            name: 'Oil Change',
            description: 'Complete oil change service.',
            price: 30
        });

        serviceId = testService._id;

        // Generate a token for the test user
        token = sign({ id: serviceId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    });

    after(async () => {
        // Clean up the database after tests
        await Service.deleteMany({});
        await mongoose.connection.close();
    });

    describe('GET /service/:id', () => {
        it('should fetch service details by ID', async () => {
            const res = await request(app)
                .get(`/service/${serviceId}`)
                .set('Authorization', `Bearer ${token}`); // Set the token in the authorization header

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('name', 'Oil Change');
            expect(res.body).to.have.property('_id', serviceId.toString());
        });

        it('should return 404 for non-existing service ID', async () => {
            const res = await request(app)
                .get('/service/invalidServiceId')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('error', 'Service not found');
        });
    });

    describe('PUT /service/:id', () => {
        it('should update service details', async () => {
            const res = await request(app)
                .put(`/service/${serviceId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Premium Oil Change', price: 40 });

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'Service updated successfully');

            // Verify the update
            const updatedService = await Service.findById(serviceId);
            expect(updatedService?.name).to.equal('Premium Oil Change');
            expect(updatedService?.price).to.equal(40);
        });

        it('should return 404 for non-existing service ID on update', async () => {
            const res = await request(app)
                .put('/service/invalidServiceId')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Another Update' });

            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('error', 'Service not found');
        });
    });

    describe('POST /service', () => {
        it('should add a new service', async () => {
            const res = await request(app)
                .post('/service')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Brake Inspection',
                    description: 'Full brake inspection and service.',
                    price: 50
                });

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('message', 'Service created successfully');

            // Verify the service was added
            const addedService = await Service.findOne({ name: 'Brake Inspection' });
            expect(addedService).to.not.be.null;
        });
    });
});
