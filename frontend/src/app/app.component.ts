import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <app-footer></app-footer>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
}
