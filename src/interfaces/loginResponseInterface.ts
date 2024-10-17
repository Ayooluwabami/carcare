import { IUser } from '../models/userModel';

export interface ILoginResponse {
    user: {
        id: string;
        username: string;
        email: string;
    };
    token: string;
}
