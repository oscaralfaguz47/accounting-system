import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class BalanceSheetService {
  public url;
  public token;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
    this.token = localStorage.getItem('token');
   }

   selectBalanceSheet(idCompany, searchType, initialDate, finalDate, month, year) {
    const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    const httpOptions = {
      params: new HttpParams()
      .set('idCompany', idCompany)
      .set('searchType', searchType)
      .set('initialDate', initialDate)
      .set('finalDate', finalDate)
      .set('month', month)
      .set('year', year),
      headers: headersObject,

    };
    return this.http.get(this.url + 'BalanceSheets/GetBalanceSheet', httpOptions);
  }
}
