import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AlertComponent} from './alert.component';
import {MessageModule} from "primeng/message";
import {MessagesModule} from "primeng/messages";
import {ToastModule} from "primeng/toast";

@NgModule({
    imports: [CommonModule, MessageModule, MessagesModule, ToastModule],
    declarations: [AlertComponent],
    exports: [AlertComponent]
})
export class AlertModule { }
