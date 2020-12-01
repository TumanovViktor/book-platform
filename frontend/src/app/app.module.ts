import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {AboutUsComponent} from './about-us/about-us.component';
import {SupportComponent} from './support/support.component';
import {BookSearchComponent} from './book-search/book-search.component';
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
import {InputTextModule} from 'primeng/inputtext';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OfferService} from './book-search/offerserivce';
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
import {CardModule} from "primeng/card";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AboutUsComponent,
    SupportComponent,
    BookSearchComponent,
    BreadcrumbsComponent,
    MenuComponent,
    RegisterComponent,
    LoginComponent,
    MyProfileComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    AppRoutingModule,
    BreadcrumbModule, MenubarModule, SharedModule, ButtonModule, RippleModule, PanelModule, TableModule, MultiSelectModule, InputTextModule,
    RatingModule, FormsModule, HttpClientModule, ReactiveFormsModule, PasswordModule, InputTextModule,
    InputMaskModule, FieldsetModule, BrowserAnimationsModule, PanelModule, ComparePasswordModule, AlertModule, MessageModule,  MessagesModule,
    ToastModule, CardModule
  ],
  providers: [
    OfferService, MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // provider used to create fake backend
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
