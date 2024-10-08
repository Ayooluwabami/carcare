import { IUser } from '../models/userModel'; 

export interface ILoginResponse {
  user: IUser;     
  token: string;       
}
