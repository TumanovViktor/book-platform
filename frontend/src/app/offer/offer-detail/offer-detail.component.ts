import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Offer} from "../offer";
import {OfferService} from "../offerservice";
import {OfferChat} from '../offer-chat';
import {OfferChatService} from "../offerchatservice";
import {BookGenre, EBookGenre} from '../book-genre';

@Component({
  selector: 'app-offer-detail',
  templateUrl: './offer-detail.component.html',
  styleUrls: ['./offer-detail.component.scss']
})
export class OfferDetailComponent implements OnInit {

  currentUserId = 1; // TODO change to take from JWT

  offerId?: number;
  offer?: Offer;

  chatDataReady: boolean = false;
  chats: OfferChat[] = [];

  bookGenreMap: Map<EBookGenre, BookGenre>;

  constructor(private offerService: OfferService, private offerChatService: OfferChatService,
    private actRoute: ActivatedRoute) {
    this.bookGenreMap = BookGenre.GenreMap;
  }

  ngOnInit() {
    this.actRoute.paramMap.subscribe(params => {
      this.offerId = Number(params.get('offerId'));
    });

    this.offerService.getOfferById(this.offerId!!)
      .then(data => {
        this.offer = data

        if (this.isOwnOffer()) {
          return this.offerChatService.getOfferChatsByOfferId(this.offerId!!);
        }
        else {
          return this.offerChatService.getOfferChatsByOfferIdAndUserId(this.offerId!!, this.currentUserId);
        }
      })
      .then(data => {
        this.chatDataReady = true;
        this.chats = data;
      });
  }

  isOwnOffer(): boolean {
    // TODO JWT userId
    return this.offer!!.userId === this.currentUserId;
  }

  sendChatMessage(msg: string) {
    // TODO send message to BE
  }
}
