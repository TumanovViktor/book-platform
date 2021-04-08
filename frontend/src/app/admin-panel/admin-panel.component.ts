import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../service/authentication.service';
import {User, UserRole} from '../model/user';
import {AlertService} from '../alert';
import {Router} from '@angular/router';
import {AdminService} from '../service/admin.service';

@Component({
  selector: 'admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit{
  users: User[];
  cols: any[];

  constructor(private authService: AuthenticationService, private alertService: AlertService, private router: Router, private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getAllUsers().subscribe(users => this.users = users);

    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'username', header: 'Username' },
      { field: 'email', header: 'E-mail' },
      { field: 'firstName', header: 'First Name' },
      { field: 'lastName', header: 'Last Name' }
    ];
    if(!this.authService.currentUserValue || !(this.authService.currentUserValue.role === UserRole.ADMIN)) {
      this.alertService.error("Pouze Administrátor má právo zobrazovat tuto stránku");
      this.router.navigate(['/home']);
    }
  }

  saveActive() {
    this.users.forEach(user => this.adminService.changeActiveState(user).subscribe());
  }
}
