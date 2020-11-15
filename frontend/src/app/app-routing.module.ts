import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SupportComponent} from "./support/support.component";
import {AboutUsComponent} from "./about-us/about-us.component";
import {BookSearchComponent} from "./book-search/book-search.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {path: '', redirectTo: '/home', pathMatch: 'full'},
      {path: 'home', component: BookSearchComponent, data: {breadcrumb: 'Inzeráty'}},
      {path: 'support', component: SupportComponent, data: {breadcrumb: 'Podpora'}},
      {path: 'about-us', component: AboutUsComponent, data: {breadcrumb: 'O nás'}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
