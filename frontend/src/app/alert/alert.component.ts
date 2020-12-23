import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {AlertService} from './alert.service';
import {Message, MessageService} from "primeng/api";

@Component({selector: 'alert', templateUrl: 'alert.component.html'})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() id = 'default-alert';
  @Input() fade = true;

  messages: Message[] = [];
  alertSubscription: Subscription;

  constructor(private router: Router,
              private alertService: AlertService,
              private messageService: MessageService) {
  }

  ngOnInit() {
    this.alertSubscription = this.alertService.onAlert(this.id)
      .subscribe(alert => {
        if (!alert.message) {
          return;
        }
        let newMessage = {severity: alert.severity, summary: alert.message, detail: ''};
        this.messageService.add(newMessage);
      });

  }

  ngOnDestroy() {
    this.alertSubscription.unsubscribe();
  }
}
