import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthbranchService implements CanActivate  {

  constructor(private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    if (sessionStorage.getItem('branchuser')) {
      return true;//return this.authservice.checkAuthorisation(state.url);
  }
        // not logged in so redirect to login page with the return url
  this.router.navigate(['/login']/* , { queryParams: { returnUrl: state.url }} */);
  return false;  }
}
