import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {AboutUsComponent} from './about-us/about-us.component';
import {SupportComponent} from './support/support.component';
import {OfferCreateComponent} from './offer/offer-create/offer-create.component';
import {OfferSearchComponent} from './offer/offer-search/offer-search.component';
import {OfferDetailComponent} from './offer/offer-detail/offer-detail.component';
import {OfferChatComponent} from './offer/offer-detail/offer-chat/offer-chat.component';
import {BreadcrumbsComponent} from './header/breadcrumbs/breadcrumbs.component';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {MenuComponent} from './header/menu/menu.component';
import {MenubarModule} from 'primeng/menubar';
import {MessageService, SharedModule} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {RatingModule} from 'primeng/rating';
import {TableModule} from 'primeng/table';
import {PanelModule} from 'primeng/panel';
import {MultiSelectModule} from 'primeng/multiselect';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {TriStateCheckboxModule} from 'primeng/tristatecheckbox';
import {TabViewModule} from 'primeng/tabview';
import {CardModule} from 'primeng/card';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {OfferService} from './offer/offerservice';
import {OfferChatService} from './offer/offerchatservice';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {PasswordModule} from "primeng/password";
import {InputMaskModule} from "primeng/inputmask";
import {FieldsetModule} from "primeng/fieldset";
import {ComparePasswordModule} from "../directive/compare-directive/compare-password.module";
import {ErrorInterceptor, fakeBackendProvider, JwtInterceptor} from './helper';
import {MyProfileComponent} from './my-profile/my-profile.component';
import {AlertModule} from "./alert";
import {MessageModule} from "primeng/message";
import {MessagesModule} from "primeng/messages";
import {ToastModule} from "primeng/toast";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AboutUsComponent,
    SupportComponent,
    OfferCreateComponent,
    OfferSearchComponent,
    OfferDetailComponent,
    OfferChatComponent,
    BreadcrumbsComponent,
    MenuComponent,
    RegisterComponent,
    LoginComponent,
    MyProfileComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    AppRoutingModule,
    BreadcrumbModule, MenubarModule, SharedModule, ButtonModule, RippleModule, PanelModule, TableModule, MultiSelectModule, DropdownModule, InputTextModule,
    InputTextareaModule, TriStateCheckboxModule, TabViewModule, RatingModule, FormsModule, HttpClientModule, ReactiveFormsModule, PasswordModule, InputTextModule,
    InputMaskModule, FieldsetModule, BrowserAnimationsModule, PanelModule, ComparePasswordModule, AlertModule, MessageModule,  MessagesModule,
    ToastModule, CardModule
  ],
  providers: [
    OfferService, OfferChatService, MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // provider used to create fake backend
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
