import {authApi} from "../http";
import { AxiosResponse } from "axios";
import { AuthResponse } from "../models/Response/AuthResponse";

export default class AuthService{
    static async login(email : string,password: string): Promise<AxiosResponse<AuthResponse>>{
        return authApi.post<AuthResponse>('/login',{email,password})
    };

    static async registration(email : string,password: string,login:string): Promise<AxiosResponse<AuthResponse>>{
        return authApi.post<AuthResponse>('/registration',{email,password,login})
    };
    
    static async logout(): Promise<void>{
        return authApi.post('/logout')
    };
}