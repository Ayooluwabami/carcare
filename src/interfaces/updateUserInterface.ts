import { ObjectId } from 'mongoose';

export interface IUpdateUserInput {
    username?: string;     
    email?: string;        
    password?: string;   
}
