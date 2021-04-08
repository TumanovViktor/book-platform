import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {AuthenticationService} from "../../service/authentication.service";
import {User, UserRole} from '../../model/user';
import {Router} from "@angular/router";
import {AlertService} from "../../alert";
import {prettyPrint} from '../../helper/Utils';

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
    this.authenticationService.currentUser.subscribe(x => {
      this.authenticatedUser = x;
      if (x) {
        this.items = this.items.concat(
          {
            label: 'Vytvořit inzerát',
            icon: 'pi pi-fw pi-plus',
            routerLink: '/create'
          });
      }
      if (x && x.role === UserRole.ADMIN) {
        this.items = this.items.concat(
          {
            label: 'Administrace',
            icon: 'pi pi-fw pi-cog',
            routerLink: '/admin'
          });
      }
    });
  }

  logout() {
    this.authenticationService.logout();
    this.items = this.items.filter(value => value.label !== 'Vytvořit inzerát' && value.label !== "Administrace");
    this.alerService.success('Úspěšné odhlášení')
    this.router.navigate(['/login']);
  }
}
