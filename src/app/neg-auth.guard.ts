import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AuthGuard} from "./auth.guard";
import {map} from "rxjs/operators";
import {AuthService} from "./auth.service";

@Injectable()
/**
 * Does the opposite of AuthGuard.
 */
export class NegAuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.isLoggedIn) {
      return false;
    }
    return this.auth.verifyLoggingStatus().pipe(map(res => {
      if (res.status) {
        this.router.navigate(['scrawler']);
        //Change login status if user is authenticated
        return false;
      } else {
        return true;
      }
    }));
  }
}
