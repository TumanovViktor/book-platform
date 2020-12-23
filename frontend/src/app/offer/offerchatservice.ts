import {Injectable} from "@angular/core";
import {HttpClient} from '@angular/common/http';
import {OfferChat} from "./offer-chat";

@Injectable()
export class OfferChatService {
  constructor(private http: HttpClient) { }

  getOfferChatsByOfferId(offerId: number): Promise<OfferChat[]> {
    return this.http.get<any>('assets/offer-chat.json')
      .toPromise()
      .then(res => (<OfferChat[]> res.data)
        .filter(ocs => { return ocs.offerId === offerId; }));
  }

  getOfferChatsByOfferIdAndUserId(offerId: number, userId: number): Promise<OfferChat[]> {
    return this.http.get<any>('assets/offer-chat.json')
      .toPromise()
      .then(res => (<OfferChat[]> res.data)
        .filter(ocs => { return ocs.offerId === offerId && ocs.byUserId === userId; }));
  }
}
