import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SupportComponent} from "./support/support.component";
import {AboutUsComponent} from "./about-us/about-us.component";
import {BookSearchComponent} from "./book-search/book-search.component";
import {RegisterComponent} from "./register/register.component";
import {LoginComponent} from "./login/login.component";
import {MyProfileComponent} from "./my-profile/my-profile.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {path: '', redirectTo: '/home', pathMatch: 'full'},
      {path: 'home', component: BookSearchComponent, data: {breadcrumb: 'Inzeráty'}},
      {path: 'support', component: SupportComponent, data: {breadcrumb: 'Podpora'}},
      {path: 'about-us', component: AboutUsComponent, data: {breadcrumb: 'O nás'}},
      {path: 'register', component: RegisterComponent, data: {breadcrumb: 'Registrace'}},
      {path: 'login', component: LoginComponent, data: {breadcrumb: 'Přihlášení'}},
      {path: 'my-profile', component: MyProfileComponent, data: {breadcrumb: 'Můj profil'}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
