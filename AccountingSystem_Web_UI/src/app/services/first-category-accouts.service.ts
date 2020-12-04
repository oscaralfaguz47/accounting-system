import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class FirstCategoryAccoutsService {

  public token;
  public url;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
   }

  getFirstCategoryAccounts() {
    const headersObject = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
    });
    const httpOptions = {
        headers: headersObject
    };
    return this.http.get(this.url + 'FirstCategoryAccounts/GetFirstCategoryAccounts', httpOptions);
}
}
