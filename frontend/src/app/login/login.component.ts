import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../service/authentication.service";
import {first} from "rxjs/operators";
import {AlertService} from "../alert";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent implements OnInit {
  returnUrl: string;
  loginModel = {
    username: '',
    password: ''
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {

    this.authenticationService.login(this.f.username, this.f.password)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Úspěšné přihlášení');
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.alertService.error(`Přihlášení neproběhlo: ${error}`);
        });
  }
  get f() { return this.loginModel; }

}
