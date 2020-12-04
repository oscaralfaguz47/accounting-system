import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class NoCompaniesGuard implements CanActivate {
    constructor(private router: Router) { }
    canActivate() {
       
        if (localStorage.getItem('idCompany') !== 'not-defined') {
            return true;
        } else {
            this.router.navigate(['inicio']);
        }
    }
}
