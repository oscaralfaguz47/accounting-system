import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  public url;
  public idCompany;
  public token;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
    this.idCompany = localStorage.getItem('idCompany');
    this.token = localStorage.getItem('token');
  }

  selectExpenses() {
    const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    const httpOptions = {
      params: new HttpParams().set('idCompany', this.idCompany),
      headers: headersObject,

    };
    return this.http.get(this.url + 'Expenses/GetExpenses', httpOptions);
  }
  selectNumberOfRegisters() {
    const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    const httpOptions = {
      params: new HttpParams().set('idCompany', this.idCompany),
      headers: headersObject,

    };
    return this.http.get(this.url + 'Expenses/GetNumberOfRegisters', httpOptions);
  }
  createExpense(dataToSend) {
    const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    const httpOptions = {
      headers: headersObject,

    };
    return this.http.post(this.url + 'Expenses/CreateExpense', dataToSend, httpOptions);
  }
  editExpense(dataToSend) {
    const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    const httpOptions = {
      headers: headersObject,

    };
    return this.http.put(this.url + 'Expenses/UpdateExpense', dataToSend, httpOptions);
  }
  deleteExpense(idExpense) {
    console.log(idExpense);
    const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });
    const httpOptions = {
      params: new HttpParams().set('idExpense', idExpense),
      headers: headersObject,
    };
    return this.http.put(this.url + 'Expenses/DeleteExpense', idExpense, httpOptions);
  }
}
