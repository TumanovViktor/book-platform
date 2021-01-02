import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {OfferChat} from '../../offer-chat';
import {OfferChatMsg} from '../../offer-chat-msg';

@Component({
  selector: 'offer-chat',
  templateUrl: './offer-chat.component.html',
  styleUrls: ['./offer-chat.component.scss']
})
export class OfferChatComponent implements OnInit {

  currentUserId = 1; // TODO change to take from JWT

  @Input() chat?: OfferChat | null = null;
  @Input() ownerName?: string | null = null; // only present for 'not-my' offers
  @Output() onSend = new EventEmitter<string>();

  chatMessage: string = "";

  constructor() {
  }

  ngOnInit() {
  }

  sendMessage() {
    if (this.chatMessage != null && this.chatMessage !== "") {
      this.onSend.emit(this.chatMessage);

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
