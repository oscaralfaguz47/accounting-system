import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class AccountAffectationsService {

  public token;
  public url;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
  }

  getAccountAffectations() {
    const headersObject = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
    });
    const httpOptions = {
        headers: headersObject
    };
    return this.http.get(this.url + 'AccountAffectations/GetAccountAffectations', httpOptions);
}
}
