import request from 'supertest';
import app from '../src/app';
import { expect } from 'chai';
import mongoose from 'mongoose';
import Mechanic from '../src/models/mechanicModel'; // Import your mechanic model
import { sign } from 'jsonwebtoken'; // Import for JWT sign

describe('Mechanic API', () => {
    let token: string;
    let mechanicId: string;

    before(async () => {
        // Connect to the test database
        await mongoose.connect(process.env.TEST_MONGODB_URI as string, { useNewUrlParser: true, useUnifiedTopology: true });

        // Create a test user for authentication
        const testUser = await Mechanic.create({
            name: 'John Doe',
            specialty: 'Engine Repair',
            experience: 5,
            contact: 'john@example.com'
        });

        mechanicId = testUser._id;

        // Generate a token for the test user
        token = sign({ id: mechanicId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    });

    after(async () => {
        // Clean up the database after tests
        await Mechanic.deleteMany({});
        await mongoose.connection.close();
    });

    describe('GET /mechanic/:id', () => {
        it('should fetch mechanic details by ID', async () => {
            const res = await request(app)
                .get(`/mechanic/${mechanicId}`)
                .set('Authorization', `Bearer ${token}`); // Set the token in the authorization header

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('name', 'John Doe');
            expect(res.body).to.have.property('_id', mechanicId.toString());
        });

        it('should return 404 for non-existing mechanic ID', async () => {
            const res = await request(app)
                .get('/mechanic/invalidMechanicId')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('error', 'Mechanic not found');
        });
    });

    describe('PUT /mechanic/:id', () => {
        it('should update mechanic details', async () => {
            const res = await request(app)
                .put(`/mechanic/${mechanicId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Jane Doe', specialty: 'Transmission Repair' });

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'Mechanic updated successfully');

            // Verify the update
            const updatedMechanic = await Mechanic.findById(mechanicId);
            expect(updatedMechanic?.name).to.equal('Jane Doe');
            expect(updatedMechanic?.specialty).to.equal('Transmission Repair');
        });

        it('should return 404 for non-existing mechanic ID on update', async () => {
            const res = await request(app)
                .put('/mechanic/invalidMechanicId')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Another Update' });

            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('error', 'Mechanic not found');
        });
    });

    describe('POST /mechanic', () => {
        it('should add a new mechanic', async () => {
            const res = await request(app)
                .post('/mechanic')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Alice Smith',
                    specialty: 'Body Work',
                    experience: 3,
                    contact: 'alice@example.com'
                });

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('message', 'Mechanic created successfully');

            // Verify the mechanic was added
            const addedMechanic = await Mechanic.findOne({ name: 'Alice Smith' });
            expect(addedMechanic).to.not.be.null;
        });
    });
});
