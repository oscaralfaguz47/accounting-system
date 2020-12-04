import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class AccountingAccoutsService {

  public token;
  public url;
  public idCompany;


  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this.idCompany = localStorage.getItem('idCompany');
  }


  getAccountingAccounts() {
    const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    const httpOptions = {
      params: new HttpParams().set('idCompany', this.idCompany),
      headers: headersObject,

    };
    return this.http.get(this.url + 'AccountingAccounts/GetAccountingAccounts', httpOptions);
  }

  selectAllAccountingAccounts() {
    const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    const httpOptions = {
      params: new HttpParams().set('idCompany', this.idCompany),
      headers: headersObject,

    };
    return this.http.get(this.url + 'AccountingAccounts/SelectAccountingAccounts', httpOptions);
  }

  selectIncomesAccountingAccounts() {
    const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    const httpOptions = {
      params: new HttpParams().set('idCompany', this.idCompany),
      headers: headersObject,

    };
    return this.http.get(this.url + 'AccountingAccounts/GetIncomesAccountingAccounts', httpOptions);
  }

  selectExpensesAccountingAccounts() {
    const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    const httpOptions = {
      params: new HttpParams().set('idCompany', this.idCompany),
      headers: headersObject,

    };
    return this.http.get(this.url + 'AccountingAccounts/GetExpensesAccountingAccounts', httpOptions);
  }

  getDefaultAccounts() {
    const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    const httpOptions = {
      headers: headersObject,

    };
    return this.http.get(this.url + 'AccountingAccounts/GetDefaultAccountingAccounts', httpOptions);
  }

  createAccountingAccount(idAccountFirstCategory, accountingAccount) {
    const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    const httpOptions = {
      params: new HttpParams().set('idAccountFirstCategory', idAccountFirstCategory),
      headers: headersObject,

    };
    return this.http.post(this.url + 'AccountingAccounts/CreateAccountingAccount', accountingAccount, httpOptions);
  }

  updateAccountingAccount(accountingAccount) {
    const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });
    const httpOptions = {
      headers: headersObject,
    };

    return this.http.put(this.url + 'AccountingAccounts/UpdateAccountingAccount', accountingAccount, httpOptions);
  }
}
