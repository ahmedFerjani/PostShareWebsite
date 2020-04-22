import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  showSpinner: boolean = false;
  constructor(public authService: AuthService) {}

  ngOnInit() {}

  onSignup(form: NgForm) {
    //console.log(form) ;
    if (form.invalid) {
      return;
    }
    try {
      this.authService.addUser(form.value.email, form.value.password);
    } catch (err) {
      console.log(err);
    } 

    this.authService.juste(form.value.email, form.value.password) ;
  }
}
