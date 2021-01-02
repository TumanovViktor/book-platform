import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SupportComponent} from "./support/support.component";
import {AboutUsComponent} from "./about-us/about-us.component";
import {OfferSearchComponent} from "./offer/offer-search/offer-search.component";
import {OfferDetailComponent} from "./offer/offer-detail/offer-detail.component";
import {OfferCreateComponent} from "./offer/offer-create/offer-create.component";
import {RegisterComponent} from "./register/register.component";
import {LoginComponent} from "./login/login.component";
import {MyProfileComponent} from "./my-profile/my-profile.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {path: '', redirectTo: '/home', pathMatch: 'full'},
      {path: 'home', component: OfferSearchComponent, data: {breadcrumb: 'Inzeráty'}},
      {path: 'detail/:offerId', component: OfferDetailComponent, data: {breadcrumb: 'Detail'}},
      {path: 'create', component: OfferCreateComponent, data: {breadcrumb: 'Nový inzerát'}},
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
