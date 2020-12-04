import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoOpeningSeatGuard implements CanActivate {
  constructor(private router: Router) { }
  canActivate(
    ){
      if (localStorage.getItem('openingSeat') === 'true') {
        return true;
    } else {
        this.router.navigate(['configuracion/asiento-apertura']);
    }
  }
  
}
