import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {map,take,tap} from 'rxjs/operators';
import {AuthenticationService} from './authentication.service';
import { Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  constructor(
    private router:Router,
    private auth:AuthenticationService,
    private alert:ToastrService
  ){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean>  | boolean {
      return this.auth.currentUser.pipe(
        take(1),map((currentUser => !!currentUser)),tap((loggedIn =>{
          if(!loggedIn){
            this.alert.error('Unauthenticated please log in','Unauthenticated');
            this.router.navigate(['/login'],{queryParams:{returnUrl:state.url}});
          }
        }))
      )
    }
}
