import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  
    constructor(
      private router: Router, 
      private authSvc: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.authSvc.isAuthenticated.pipe(take(1), map(isAuth => !isAuth));
    }
}
