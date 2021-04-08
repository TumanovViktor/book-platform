import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {OfferChat} from '../../offer-chat';
import {OfferChatMsg} from '../../offer-chat-msg';
import {ActivatedRoute} from '@angular/router';
import {AuthenticationService} from '../../../service/authentication.service';

@Component({
  selector: 'offer-chat',
  templateUrl: './offer-chat.component.html',
  styleUrls: ['./offer-chat.component.scss']
})
export class OfferChatComponent implements OnInit {

  currentUserId;

  @Input() chat?: OfferChat | null = null;
  @Input() ownerName?: string | null = null; // only present for 'not-my' offers
  @Output() onSend = new EventEmitter<any>();

  chatMessage: string = "";

  constructor(private authService: AuthenticationService) {
  }

  ngOnInit() {
    this.currentUserId = this.authService.currentUserValue.id;
  }

  sendMessage() {
    if (this.chatMessage != null && this.chatMessage !== "") {
      this.onSend.emit( {msg: this.chatMessage, byUserId: this.chat.byUserId});

      let chatMsg = {
        byUserId: this.currentUserId,
        message: this.chatMessage,
        createdDate: new Date().toISOString()
      } as OfferChatMsg;

      if (!this.chat) {
        this.createChat();
      }
      this.chat!!.msgs.push(chatMsg);

      this.chatMessage = "";
    }
  }

  createChat() {
    this.chat = {
      byUserId: this.currentUserId,
      msgs: [] as OfferChatMsg[]
    } as OfferChat;
  }
}
