import {IUser} from "../models/IUser"
import {makeAutoObservable} from 'mobx'
import AuthService from "../services/AuthService";
import { authApi } from '../http';
import { AuthResponse } from "../models/Response/AuthResponse";

export default class Store{
    user = {} as IUser;
    isAuth = false;
    isLoading = true;
    constructor(){
        makeAutoObservable(this);
    };
 
    setAuth(bool: boolean){
        this.isAuth = bool;
    };

    setUser(user: IUser){
        this.user = user;
    };
    setLoading(bool: boolean){
        this.isLoading = bool;
    };


    async login(email: string,password:string){
        try{
            const response = await AuthService.login(email,password);
            localStorage.setItem('token',response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
            return;
        }catch(e){
            console.log(e.response?.data?.message);
            throw e;
        }
    };

    async registration(email: string,password:string,login: string){
        try{
            const response = await AuthService.registration(email,password,login);
            localStorage.setItem('token',response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        }catch(e){
            console.log(e.response?.data?.message)
        }
    };
    async logout(){
        try{
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
        }catch(e){
            console.log(e.response?.data?.message)
        }
    };
    async checkAuth() {
        this.setLoading(true);
        try {
          const response = await authApi.get<AuthResponse>('/refresh'); 
          localStorage.setItem('token', response.data.accessToken);
          this.setAuth(true);
          this.setUser(response.data.user);
        } catch (e) {
          console.log('Unauthorized user, redirect to login');
        } finally {
          this.setLoading(false);
        }
      }
};

