import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/userModel';
import { ILoginResponse } from '../interfaces/loginResponseInterface';
import { Document } from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || ''; 

export class AuthService {
    // Register a new user
    async registerUser(data: { email: string; password: string }): Promise<IUser & Document> {
        const { email, password } = data;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw { status: 400, message: 'User already exists' }; 
        }

        const newUser = new User({ email, password });
        return await newUser.save();
    }

    // Login a user
    async loginUser(data: { email: string; password: string }): Promise<ILoginResponse> {
        const { email, password } = data;

        const user = await User.findOne({ email }).exec();
        if (!user) {
            throw { status: 401, message: 'Invalid login' };
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw { status: 401, message: 'Invalid login' }; 
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        return {
            token,
            user: { id: (user._id as any).toString(), username: user.username, email },
        };
    }

    // Refresh token
    async refreshToken(token: string): Promise<string> {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
            return jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: '1h' });
        } catch (error) {
            throw { status: 401, message: 'Invalid or expired token' }; 
        }
    }
}
