import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class JournalMovementsService {

  public token;
  public url;
  public idCompany;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this.idCompany = localStorage.getItem('idCompany');
   }

  getOpeningSeatJournalMovements(idCompany) {
    const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    const httpOptions = {
      params: new HttpParams().set('idCompany', idCompany),
      headers: headersObject,

    };
    return this.http.get(this.url + 'JournalMovements/GetOpeningSeatJournalMovements', httpOptions);
  }

  getJournalMovements(idJournalSeat: any) {
    const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    const httpOptions = {
      params: new HttpParams().set('idJournalSeat', idJournalSeat),
      headers: headersObject,

    };
    return this.http.get(this.url + 'JournalMovements/GetJournalMovements', httpOptions);
  }

  getDetailedJournalMovements(idJournalSeat: any) {
    const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });

    const httpOptions = {
      params: new HttpParams().set('idJournalSeat', idJournalSeat),
      headers: headersObject,

    };
    return this.http.get(this.url + 'JournalMovements/GetDetailedJournalMovements', httpOptions);
  }
}
