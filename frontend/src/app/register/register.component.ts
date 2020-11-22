import {Component} from '@angular/core';
import {RegistrationModel} from "./RegistrationModel";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: []
})
export class RegisterComponent {
  // registerForm = new FormGroup({
  //   email: new FormControl('',[
  //     Validators.required,
  //     Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
  //   password: new FormControl('')
  // });
  registrationModel = new RegistrationModel('','');

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.registrationModel.email.invalid);
    // console.warn(this.registerForm.value);
  }

  // get email(){
  //   return this.registerForm.get('email');
  // }
}
