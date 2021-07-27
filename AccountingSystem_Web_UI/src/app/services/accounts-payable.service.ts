import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class AccountsPayableService {

  public url;
  public idCompany;
  public token;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
    this.idCompany = localStorage.getItem('idCompany');
    this.token = localStorage.getItem('token');
  }

  selectAccountsPayable(skipNumber, numberRegisters) {
    const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });
    const httpOptions = {
      params: new HttpParams()
      .set('idCompany', this.idCompany)
      .set('numberRegisters', numberRegisters)
      .set('skipNumber', skipNumber),
      headers: headersObject,
    };
    return this.http.get(this.url + 'AccountsPayable/GetAccountsPayable', httpOptions);
  }

  selectNumberOfRegisters() {

    const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    const httpOptions = {
      params: new HttpParams()
      .set('idCompany', this.idCompany),
      headers: headersObject,

    };
    return this.http.get(this.url + 'AccountsPayable/GetNumberOfRegisters', httpOptions);
  }
  filterAccountsPayable(skipNumber, numberRegisters, criteria) {
    const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });
    const httpOptions = {
      params: new HttpParams()
      .set('idCompany', this.idCompany)
      .set('numberRegisters', numberRegisters)
      .set('skipNumber', skipNumber)
      .set('criteria', criteria),
      headers: headersObject,
    };
    return this.http.get(this.url + 'AccountsPayable/FilterAccountsPayable', httpOptions);
  }
  payAccountPayable(dataToSend) {
    const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    const httpOptions = {
      headers: headersObject,

    };
    return this.http.post(this.url + 'AccountsPayable/PayAccountPayable', dataToSend, httpOptions);
  }
}
