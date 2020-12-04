import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class D151Service {

  public url;
  public idCompany;
  public token;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
    this.idCompany = localStorage.getItem('idCompany');
    this.token = localStorage.getItem('token');
   }

  selectD151OptionsIncomes() {
    const headersObject = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
    });

    const httpOptions = {
        params: new HttpParams().set('idCompany', this.idCompany),
        headers: headersObject,

    };
    return this.http.get(this.url + 'D151Options/GetD151OptionsIncomes', httpOptions);
}
selectD151OptionsExpenses() {
  const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
  });

  const httpOptions = {
      params: new HttpParams().set('idCompany', this.idCompany),
      headers: headersObject,

  };
  return this.http.get(this.url + 'D151Options/GetD151OptionsExpenses', httpOptions);
}
}
