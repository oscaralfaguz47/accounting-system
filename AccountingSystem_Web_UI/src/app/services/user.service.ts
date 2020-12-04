import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { User } from '../components/models/user';
import * as jwt_decode from 'jwt-decode';
import { Company } from '../components/models/company';


@Injectable()
export class UserService {
    public url: string;
    public token;
    public idCompany;
    public identity;

    constructor(private http: HttpClient) {
        this.url = GLOBAL.url;
        this.token = localStorage.getItem('token');
        this.idCompany = localStorage.getItem('idCompany');
        
    }

    getUsers() {
        const headersObject = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token
        });
        const httpOptions = {
            params: new HttpParams().set('idCompany', this.idCompany),
            headers: headersObject
        };
        return this.http.get<User>(this.url + 'UserCompanies/GetUsers', httpOptions);
    }


    register(user): Observable<User> {
        return this.http.post<User>(this.url + 'Users/CreateUser', user);
    }

    createUserFromUser(idUserLogedIn, user) {
        console.log('Este es el usuario', user);
        const headersObject = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token,
        });

        const httpOptions = {
            params: new HttpParams().set('idUserLogedIn', idUserLogedIn),
            headers: headersObject,

        };

        return this.http.post(this.url + 'Users/CreateUserFromUser', user, httpOptions);
    }

    updateUser(user) {
        const headersObject = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token,
        });

        const httpOptions = {
            headers: headersObject,

        };

        return this.http.put(this.url + 'Users/UpdateUser', user, httpOptions);
    }

    activateUser(idUser) {
        const headersObject = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token,
        });

        const httpOptions = {
            params: new HttpParams().set('idUser', idUser),
            headers: headersObject,

        };

        return this.http.put(this.url + 'Users/ActivateUser', idUser, httpOptions);
    }

    deactivateUser(idUser) {
        console.log(idUser);
        const headersObject = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token,
        });

        const httpOptions = {
            params: new HttpParams().set('idUser', idUser),
            headers: headersObject,

        };

        return this.http.put(this.url + 'Users/DeactivateUser', idUser, httpOptions);
    }

    signUp(credentials) {
        return this.http.post<User>(this.url + 'Users/Login', credentials);
    }
    selectFirstCompany(idUser: any, token: any) {
        const headersObject = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        });
        const httpOptions = {
            params: new HttpParams().set('idUser', idUser),
            headers: headersObject
        };
        return this.http.get<Company>(this.url + 'UserCompanies/SelectFirstCompany', httpOptions);
    }

    getIdentity() {
        const identity = JSON.parse(localStorage.getItem('identity'));
        if (identity !== 'undefined') {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;
    }

    getTockenLocalStorage() {
        const token = localStorage.getItem('token');
        if (token !== 'undefined') {
            this.token = token;
        } else {
            this.token = null;
        }
        return this.token;
    }

}
