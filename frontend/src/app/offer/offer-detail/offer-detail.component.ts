import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Offer} from '../offer';
import {OfferService} from '../offerservice';
import {OfferChat} from '../offer-chat';
import {OfferChatService} from '../offerchatservice';
import {BookGenre, EBookGenre} from '../book-genre';
import {AuthenticationService} from '../../service/authentication.service';
import {prettyPrint} from '../../helper/Utils';
import {User} from '../../model/user';
import {AlertService} from '../../alert';

@Component({
  selector: 'app-offer-detail',
  templateUrl: './offer-detail.component.html',
  styleUrls: ['./offer-detail.component.scss']
})
export class OfferDetailComponent implements OnInit {

  currentUser: User;

  offerId?: number;
  offer?: Offer;

  chatDataReady: boolean = false;
  chats: OfferChat[] = [];

  showReview: boolean = false;

  bookGenreMap: Map<EBookGenre, BookGenre>;

  constructor(private offerService: OfferService, private offerChatService: OfferChatService,
              private actRoute: ActivatedRoute, private authService: AuthenticationService,
              private alertService: AlertService, private router: Router) {
    this.bookGenreMap = BookGenre.GenreMap;
  }

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.actRoute.paramMap.subscribe(params => {
      this.offerId = Number(params.get('offerId'));
    });

    this.offerService.getOfferById(this.offerId!!)
      .then(data => {
        this.offer = data;

        if (this.isOwnOffer()) {

          this.offerChatService.getAllOwnerChatsByOfferId(this.offerId)
            .then(bidders => {
              bidders.forEach(bidder => {
                this.offerChatService.getAllByOfferId(this.offerId, bidder.bidderId)
                  .then(chatMsgs => {
                    let chat = {
                      byUserId: bidder.bidderId,
                      byUserName: `${bidder.bidderFirstName} ${bidder.bidderLastName}`,
                      offerId: this.offerId,
                      msgs: chatMsgs
                    };
                    this.chats.push(chat);
                  });
                this.chatDataReady = true;
              });
              this.chatDataReady = true;
            });
        } else {
          this.offerChatService.getAllByOfferId(this.offerId!!)
            .then(chatMessages => {
              this.chats.push({
                byUserId: this.currentUser.id,
                byUserName: this.currentUser.firstName,
                offerId: this.offerId,
                msgs: chatMessages
              });
              this.chatDataReady = true;
            });
        }
      });
  }

  isOwnOffer(): boolean {
    return this.offer.userId === this.currentUser.id;
  }

  sendChatMessage(event) {
    this.offerChatService.sendMessageToChat(event.msg, this.offerId, event.byUserId).subscribe();
  }

  endOffer() {
    this.offerService.endOffer(this.offerId).toPromise().then(() => {
      this.alertService.success('Inzerát byl ukončen');
      this.router.navigate(['/home']);
    });
  }
}
