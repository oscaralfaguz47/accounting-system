import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class ProvidersService {

  public token;
  public idCompany;
  public url;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this.idCompany = localStorage.getItem('idCompany');
  }


  getProviders() {
    const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    });
    const httpOptions = {
      params: new HttpParams().set('idCompany', this.idCompany),
      headers: headersObject
    };
    return this.http.get(this.url + 'Providers/GetProviders', httpOptions);
  }

  getProvidersList(idCompany: any) {
    const headersObject = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
    });

    const httpOptions = {
        params: new HttpParams().set('idCompany', idCompany),
        headers: headersObject,

    };
    return this.http.get(this.url + 'Providers/ProvidersList', httpOptions);
}

  createProvider(provider) {
    const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    });
    const httpOptions = {
      headers: headersObject
    };
    return this.http.post(this.url + 'Providers/CreateProvider', provider, httpOptions);
  }

  updateProvider(provider) {
    const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    });
    const httpOptions = {
      headers: headersObject
    };
    return this.http.put(this.url + 'Providers/UpdateProvider', provider, httpOptions);
  }

  deleteProvider(idProvider) {
    const headersObject = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    });
    const httpOptions = {
      params: new HttpParams().set('idProvider', idProvider),
      headers: headersObject
    };
    return this.http.put(this.url + 'Providers/DeleteProvider', idProvider, httpOptions);
  }
}
