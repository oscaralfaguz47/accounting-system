import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class MonthlyClosingsService {

  public idCompany;
  public url: string;
  public token;

  constructor(private http: HttpClient) {
    this.idCompany = localStorage.getItem('idCompany');
    this.url = GLOBAL.url;
    this.token = localStorage.getItem('token');
  }

  selectMonthlyClosings() {
    const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    const httpOptions = {
      params: new HttpParams().set('idCompany', this.idCompany),
      headers: headersObject,

    };
    return this.http.get(this.url + 'MonthlyClosings/GetMonthlyClosings', httpOptions);
  }

  createMonthlyClosing(closing) {
    const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    const httpOptions = {
      headers: headersObject,
    };
    return this.http.post(this.url + 'MonthlyClosings/CreateMonthlyClosing', closing, httpOptions);
  }

  deleteMonthlyClosing(idMonthlyClosing) {
    const headersObject = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
    });
    const httpOptions = {
        params: new HttpParams().set('idCustomer', idMonthlyClosing),
        headers: headersObject,
    };
    return this.http.put(this.url + 'MonthlyClosings/DeleteMonthlyClosing', idMonthlyClosing, httpOptions);
}
}
