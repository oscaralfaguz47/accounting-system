import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { GLOBAL } from './global';




@Injectable()
export class CustomerService {
    public url: string;
    public token;

    constructor(private http: HttpClient) {
        this.url = GLOBAL.url;
        this.token = localStorage.getItem('token');
    }

    SelectCustomers(idCompany: any) {
        const headersObject = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token,
        });

        const httpOptions = {
            params: new HttpParams().set('idCompany', idCompany),
            headers: headersObject,

        };
        return this.http.get(this.url + 'Customers/SelectCustomers', httpOptions);
    }

    getCustomersList(idCompany: any) {
        const headersObject = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token,
        });

        const httpOptions = {
            params: new HttpParams().set('idCompany', idCompany),
            headers: headersObject,

        };
        return this.http.get(this.url + 'Customers/CustomersList', httpOptions);
    }

    createCustomer(customer) {
        const headersObject = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token,
        });

        const httpOptions = {
            headers: headersObject,

        };
        return this.http.post(this.url + 'Customers/CreateCustomer', customer, httpOptions);
    }

    updateCustomer(customer) {
        const headersObject = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token,
        });
        const httpOptions = {
            headers: headersObject,
        };
        return this.http.put(this.url + 'Customers/UpdateCustomer', customer, httpOptions);
    }

    deleteCustomer(idCustomer) {
        console.log(idCustomer);
        const headersObject = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token,
        });
        const httpOptions = {
            params: new HttpParams().set('idCustomer', idCustomer),
            headers: headersObject,
        };
        return this.http.put(this.url + 'Customers/DeleteCustomer', idCustomer, httpOptions);
    }


}
