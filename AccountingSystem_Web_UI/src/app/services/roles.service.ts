import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private url;
  private token;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
    this.token = localStorage.getItem('token');
  }

  getRoles() {
    const headersObject = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
    });
    const httpOptions = {
        headers: headersObject
    };
    return this.http.get(this.url + 'Roles/GetRoles', httpOptions);
}
}
