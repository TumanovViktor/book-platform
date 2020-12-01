import {Component} from '@angular/core';
import {RegistrationModel} from "./RegistrationModel";
import {first} from "rxjs/operators";
import {UserService} from "../service/user.service";
import {Router} from "@angular/router";
import {AlertService} from "../alert";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: []
})
export class RegisterComponent {
  public registrationModel: RegistrationModel = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: ''
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private alertService: AlertService
  ) {
  }

  onSubmit() {
    let user = {
      username: this.registrationModel.username,
      email: this.registrationModel.email,
      password: this.registrationModel.password,
      id: -1,
      token: ''
    }

    this.userService.register(user)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Úspěšná registrace', {severity: 'success', summary: 'Success'});
          this.router.navigate(['/login']);
        },
        error => {
          this.alertService.error(error);
        });
  }
}
