import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {AuthenticationService} from "../../service/authentication.service";
import {User} from "../../model/user";
import {Router} from "@angular/router";
import {AlertService} from "../../alert";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: []
})
export class MenuComponent implements OnInit {
  items: MenuItem[];
  authenticatedUser: User;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private alerService: AlertService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.authenticatedUser = x);
  }

  ngOnInit(): void {
    this.items = [
      {
        label: 'O nás',
        icon: 'pi pi-fw pi-star',
        routerLink: '/about-us'
      },
      {
        label: 'Podpora',
        icon: 'pi pi-fw pi-envelope',
        routerLink: '/support'
      }
    ];

    if (this.authenticatedUser) {
      this.items.push(
        {
          label: 'Vytvořit inzerát',
          icon: 'pi pi-fw pi-plus',
          routerLink: '/create'
        });
    }
  }

  logout() {
    this.authenticationService.logout();
    this.alerService.success('Úspěšné odhlášení')
    this.router.navigate(['/login']);
  }
}
