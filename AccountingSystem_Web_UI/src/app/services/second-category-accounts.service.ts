import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class SecondCategoryAccountsService {

  public token;
  public url;

  constructor( private http: HttpClient) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
   }
  getSecondCategoryAccounts(idFirstCategoryAccount) {
    const headersObject = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
    });
    const httpOptions = {
      params: new HttpParams().set('idFirstCategoryAccount', idFirstCategoryAccount),
        headers: headersObject
    };
    return this.http.get(this.url + 'SecondCategoryAccounts/GetSecondCategoryAccounts', httpOptions);
}
}
