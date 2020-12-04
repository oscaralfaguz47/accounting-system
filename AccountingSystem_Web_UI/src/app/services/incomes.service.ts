import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class IncomesService {

  public url;
  public idCompany;
  public token;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
    this.idCompany = localStorage.getItem('idCompany');
    this.token = localStorage.getItem('token');
   }

  SelectIncomes() {
    const headersObject = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
    });

    const httpOptions = {
        params: new HttpParams().set('idCompany', this.idCompany),
        headers: headersObject,

    };
    return this.http.get(this.url + 'Incomes/GetIncomes', httpOptions);
}

createSale(dataToSend) {
  const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
  });

  const httpOptions = {
      headers: headersObject,

  };
  return this.http.post(this.url + 'Incomes/CreateIncome', dataToSend, httpOptions);
}
editSale(dataToSend) {
  const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
  });

  const httpOptions = {
      headers: headersObject,

  };
  return this.http.put(this.url + 'Incomes/UpdateIncome', dataToSend, httpOptions);
}
deleteIncome(idIncome) {
  const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
  });
  const httpOptions = {
      params: new HttpParams().set('idIncome', idIncome),
      headers: headersObject,
  };
  return this.http.put(this.url + 'Incomes/DeleteIncome', idIncome, httpOptions);
}
}
