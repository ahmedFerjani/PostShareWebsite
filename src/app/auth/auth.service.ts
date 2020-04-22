import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Auth } from "./auth.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private token: string;
  private statusListener = new Subject<boolean>();
  private isAuth = false;
  private tokenTimer: any;
  private userId: any;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getStatusListener() {
    return this.statusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuth;
  }

  getUserId() {
    return this.userId;
  }

  juste(email: string, password: string) {
    const auth: Auth = { email: email, password: password };
    console.log(JSON.stringify(auth));
  }

  addUser(email: string, password: string) {
    const auth: Auth = { email: email, password: password };
    this.http
      .post("http://127.0.0.1:3000/user/signup", auth)
      .subscribe(response => {
        console.log(response);
        this.router.navigate(["/"]);
      }, err => {
        
      });
  }

  login(email: string, password: string) {
    const auth: Auth = { email: email, password: password };
    this.http
      .post<{ token: string; tokenExpires: number; userId: any }>(
        "http://127.0.0.1:3000/user/login",
        auth
      )
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const tokenDuration: number = response.tokenExpires;
          // console.log("before timeout");
          // console.log(tokenExpires);
          // console.log(response.token);
          this.setTimer(tokenDuration);
          this.isAuth = true;
          this.userId = response.userId;

          this.statusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + tokenDuration * 1000);

          this.saveAuth(token, expirationDate,this.userId);
          this.autoAuth();
          this.router.navigate(["/"]);
        }
      });
  }

  logout() {
    this.token = null;
    this.isAuth = false;
    clearTimeout(this.tokenTimer);
    this.statusListener.next(false);
    this.clearAuth();
    this.userId = null;
    this.router.navigate(["/"]);
  }

  private saveAuth(token: string, expirationDate: Date, userId: any) {
    localStorage.setItem("token", token);
    console.log("from saveAuth expiration = " + expirationDate);
    localStorage.setItem("expirationDate", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("userId") ;
  }

  private getAuth() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expirationDate");
    const userId = localStorage.getItem("userId") ;
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId : userId
    };
  }

  setTimer(duration: number) {
    console.log("will logout after " + duration * 1000 + "miliseq");
    this.tokenTimer = setTimeout(() => {
      console.log("logout from timer");

      this.logout();
    }, duration * 1000); // *1000 to convert to mil sec
  }

  autoAuth() {
    const authInformation = this.getAuth();
    //console.log("*****");
    //console.log(authInformation);
    if (!authInformation) {
      //console.log("no authentication");
      return;
    }
    const now = new Date();
    const duration = authInformation.expirationDate.getTime() - now.getTime();
    //console.log("duration : " + duration);
    if (duration > 0) {
      this.token = authInformation.token;
      this.isAuth = true;
      this.userId = authInformation.userId ;
      this.setTimer(duration / 1000);
      this.statusListener.next(true);
    }
  }
}
