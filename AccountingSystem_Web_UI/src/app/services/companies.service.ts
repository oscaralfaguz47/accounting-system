import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { GLOBAL } from './global';
import { Company } from '../components/models/company';
import { Observable } from 'rxjs/Observable';




@Injectable()
export class CompaniesService {
    public url: string;
    public idUser;
    public token;
    public idUserCreator;
    public idCompanyCreator;


    constructor(private http: HttpClient) {
        this.url = GLOBAL.url;
        this.token = localStorage.getItem('token');
        this.idUser = JSON.parse(localStorage.getItem('identity')).IdUser;
    }

    getCompanies(idUser: any) {
        const headersObject = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token,
        });

        const httpOptions = {
            params: new HttpParams().set('idUser', this.idUser),
            headers: headersObject,

        };
        return this.http.get(this.url + 'UserCompanies/GetUserCompanies', httpOptions);
    }

    companiesSelect(idUser: any) {
        const headersObject = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token,
        });

        const httpOptions = {
            params: new HttpParams().set('idUser', this.idUser),
            headers: headersObject,

        };
        return this.http.get<Company>(this.url + 'UserCompanies/SelectCompanies', httpOptions);
    }

    createFirstCompany(company): Observable<Company> {
        this.idUserCreator = this.idUser;
        console.log(this.idUserCreator);
        const headersObject = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token,
        });

        const httpOptions = {
            params: new HttpParams().set('idUserCreator', this.idUserCreator),
            headers: headersObject,

        };

        return this.http.post<Company>(this.url + 'Companies/CreateFirstCompany', company, httpOptions);
    }

    createCompany(company): Observable<Company> {
        this.idCompanyCreator = localStorage.getItem('idCompany');
        const headersObject = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token,
        });

        const httpOptions = {
            params: new HttpParams().set('idCompanyCreator', this.idCompanyCreator),
            headers: headersObject,

        };

        return this.http.post<Company>(this.url + 'Companies/CreateCompany', company, httpOptions);
    }

    updateCompany(company) {
        const headersObject = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token,
        });

        const httpOptions = {
            headers: headersObject,
        };

        return this.http.put(this.url + 'Companies/UpdateCompany', company, httpOptions);
    }

    deleteCompany(idCompany) {
        const headersObject = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token,
        });

        const httpOptions = {
            params: new HttpParams().set('idCompany', idCompany),
            headers: headersObject,
        };

        return this.http.put(this.url + 'Companies/DeleteCompany', idCompany, httpOptions);
    }

}
