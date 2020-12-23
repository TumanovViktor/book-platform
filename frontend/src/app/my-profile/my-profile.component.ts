import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../service/authentication.service";
import {AlertService} from "../alert";

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
})
export class MyProfileComponent implements OnInit {
  currentUser: any;
  public imagePath;
  imgURL: any = "assets/images/anonymous_user.jpg";

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService)
  {
    if (!authenticationService.currentUserValue) {
      this.router.navigate(['/login']);
    }
    authenticationService.currentUser.subscribe(x => this.currentUser = {
      username: x.username,
      email: x.email,
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
      this.imgURL = reader.result;
    }
  }

  onUpload() {
    this.alertService.success("Fotka úspěšně uložená")
  }

  onSubmit() {
    this.alertService.success("Nové údaje jsou uložené")
  }
}
