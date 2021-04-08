import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../service/authentication.service";
import {AlertService} from "../alert";
import {first} from 'rxjs/operators';
import {UserService} from '../service/user.service';
import {prettyPrint} from '../helper/Utils';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
})
export class MyProfileComponent implements OnInit {
  currentUser: any;
  public imagePath;
  defaultImage: any = "assets/images/anonymous_user.jpg";

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService)
  {
    if (!authenticationService.currentUserValue) {
      this.router.navigate(['/login']);
    }
    authenticationService.currentUser.subscribe(x => this.currentUser = {
      userId: x.id,
      username: x.username,
      email: x.email,
      firstName: x.firstName,
      lastName: x.lastName,
      image: x.image || this.defaultImage,
      password: '',
      passwordConfirm: ''
    });
  }

  ngOnInit(): void {
  }

  preview(files) {
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      // this.message = "Only images are supported.";
      return;
    }

    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      // console.log(prettyPrint(reader.result))
      this.currentUser.image = reader.result;
    }
  }

  onSubmit() {
    this.userService.update(this.currentUser)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Údaje byly úspěšně uloženy', {severity: 'success', summary: 'Success'});
          this.authenticationService.updateAuthenticatedUser(data);
        },
        error => {
          // console.log(prettyPrint(error));
          this.alertService.error(error);
        });
  }
}
