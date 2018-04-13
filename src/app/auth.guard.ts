import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {AuthService} from "./services/auth.service";
import {map} from "rxjs/operators";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.isLoggedIn) {
      return true;
    }
    return this.auth.verifyLoggingStatus().pipe(map(res => {
      if (res.status) {
        //Change login status if user is authenticated
        this.auth.setLoggedIn(true);
        //Return true so it lets us navigate to the page
        return true;
      } else {
        this.auth.setLoggedIn(false);
        //Send user to login screen
        this.router.navigate(['login']);
        return false;
      }
    }))
  }
}
