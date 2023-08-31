import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AccountService } from '../account/account.service';

@Injectable({
  providedIn: 'root'
})
export class AdminauthGuard {
  constructor(private account:AccountService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.account.currentUser$.pipe(
      map(user =>{
        if(user.role?.includes('Admin') || user.role?.includes('Manager')){
          return true;
        }
        console.log('You not allowed!')
        return false
      })
    )
  }
}