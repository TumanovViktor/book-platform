import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SupportComponent} from "./support/support.component";
import {AboutUsComponent} from "./about-us/about-us.component";
import {OfferSearchComponent} from "./offer/offer-search/offer-search.component";
import {OfferDetailComponent} from "./offer/offer-detail/offer-detail.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {path: '', redirectTo: '/home', pathMatch: 'full'},
      {path: 'home', component: OfferSearchComponent, data: {breadcrumb: 'Inzeráty'}},
      {path: 'detail/:offerId', component: OfferDetailComponent, data: {breadcrumb: 'Detail'}},
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
