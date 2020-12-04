import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class LoggedinGuard implements CanActivate {
    constructor(private router: Router, private userService: UserService) { }
    canActivate() {
        const token = this.userService.getTockenLocalStorage();
        if (token) {
            return true;
        } else {
            this.router.navigate(['login']);
        }
    }
}
