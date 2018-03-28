import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {AuthService} from "./auth.service";
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
        this.auth.setLoggedIn(true);
        return true;
      } else {
        this.router.navigate(['login']);
        return false;
      }
    }))
  }
}
