import {Component} from '@angular/core';
import {RegistrationModel} from "./RegistrationModel";
import {first} from "rxjs/operators";
import {UserService} from "../service/user.service";
import {Router} from "@angular/router";
import {AlertService} from "../alert";
import {UserRole} from '../model/user';

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
    passwordConfirm: '',
    firstName: '',
    lastName: ''
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
      firstName: this.registrationModel.firstName,
      lastName: this.registrationModel.lastName,
      image: '',
      id: -1,
      token: '',
      active: true,
      role: UserRole.USER
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
