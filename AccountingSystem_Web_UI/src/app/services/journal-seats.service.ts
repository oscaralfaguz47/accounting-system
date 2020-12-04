import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { GLOBAL } from './global';

@Injectable({
    providedIn: 'root'
})
export class JournalSeatsService {

    public token;
    public url;
    public idCompany;

    constructor(private http: HttpClient) {
        this.token = localStorage.getItem('token');
        this.url = GLOBAL.url;
        this.idCompany = localStorage.getItem('idCompany');
        
    }

    selectJournalSeats() {
        const headersObject = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token,
        });

        const httpOptions = {
            params: new HttpParams().set('idCompany', this.idCompany),
            headers: headersObject,

        };
        return this.http.get(this.url + 'JournalSeats/GetJournalSeats', httpOptions);
    }
    selectOpeningSeat() {
        const headersObject = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token,
        });

        const httpOptions = {
            params: new HttpParams().set('idCompany', this.idCompany),
            headers: headersObject,

        };
        return this.http.get(this.url + 'JournalSeats/GetOpeningSeat', httpOptions);
    }
    createJournalSeat(journalSeat) {
        const headersObject = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token,
        });

        const httpOptions = {
            headers: headersObject,

        };
        return this.http.post(this.url + 'JournalSeats/CreateJournalSeat', journalSeat, httpOptions);
    }

    updateOpeningJournalSeat(journalSeat) {
        const headersObject = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token,
        });
        const httpOptions = {
            headers: headersObject,
        };
        return this.http.put(this.url + 'JournalSeats/UpdateOpeningSeat', journalSeat, httpOptions);
    }

    updateJournalSeat(journalSeat) {
        const headersObject = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token,
        });
        const httpOptions = {
            headers: headersObject,
        };
        return this.http.put(this.url + 'JournalSeats/UpdateJournalSeat', journalSeat, httpOptions);
    }

    deleteJournalSeat(idJournalSeat) {
        const headersObject = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token,
        });
        const httpOptions = {
            params: new HttpParams().set('idJournalSeat', idJournalSeat),
            headers: headersObject,
        };
        return this.http.put(this.url + 'JournalSeats/DeleteJournalSeat', idJournalSeat, httpOptions);
    }

}
