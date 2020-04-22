import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userStatusListenerSub;
  isAuth = false;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isAuth = this.authService.getIsAuth();
    this.userStatusListenerSub = this.authService
      .getStatusListener()
      .subscribe(res => {
        this.isAuth = res;
      });
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userStatusListenerSub.unsubscribe();
  }
}
