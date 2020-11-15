import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: []
})
export class MenuComponent implements OnInit {
  items: MenuItem[];

  constructor() {
    this.items = [];
  }

  ngOnInit(): void {
    this.items = [
      {
        label:'O nás',
        icon:'pi pi-fw pi-star',
        routerLink: '/about-us'
      },
      {
        label:'Podpora',
        icon:'pi pi-fw pi-envelope',
        routerLink: '/support'
      },
      {
        label:'Žánry',
        icon:'pi pi-fw pi-align-justify',
        routerLink: '/'
      },
      {
        label:'Autoři',
        icon:'pi pi-fw pi-users',
        routerLink: '/'
      }
    ];
  }

}
