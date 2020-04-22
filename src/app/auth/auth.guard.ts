import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from './auth.service';

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {

  constructor(private authService:AuthService, private router:Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

      const isAuth = this.authService.getIsAuth() ;
      console.log(isAuth) ;
      if (!isAuth) {
        //console.log("will be redirected to login page") ;
        this.router.navigate(["/login"]);
      }
    return this.authService.getIsAuth() ;
  }
}
