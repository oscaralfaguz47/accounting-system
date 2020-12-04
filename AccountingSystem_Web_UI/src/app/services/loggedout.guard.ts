import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class LoggedoutGuard implements CanActivate {
    constructor(private router: Router, private userService: UserService) { }
    canActivate() {
        const token = this.userService.getTockenLocalStorage();
        if (token == null) {
            return true;
        } else {
            this.router.navigate(['inicio']);
        }
    }
}
