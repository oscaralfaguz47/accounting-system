import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class MovementTypesService {

  public url;
  public idCompany;
  public token;

  constructor(private http: HttpClient) { 
    this.url = GLOBAL.url;
    this.idCompany = localStorage.getItem('idCompany');
    this.token = localStorage.getItem('token');
  }
  selectMovementTypes() {
    const headersObject = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
    });

    const httpOptions = {
        params: new HttpParams().set('idCompany', this.idCompany),
        headers: headersObject,

    };
    return this.http.get(this.url + 'MovementTypes/GetMovementTypes', httpOptions);
}
}
