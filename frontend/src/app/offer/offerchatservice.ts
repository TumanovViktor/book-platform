import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from '@angular/common/http';
import {OfferChat} from "./offer-chat";
import {OfferChatMsg} from './offer-chat-msg';

@Injectable()
export class OfferChatService {
  constructor(private http: HttpClient) { }

  getAllByOfferId(offerId: number, bidderId: number = null): Promise<OfferChatMsg[]> {
    let params;
    if (bidderId){
      params = new HttpParams().set("bidderId", String(bidderId));
    }
    return this.http.get<any>(`offer/chat/${offerId}`, {params: params})
      .toPromise();
  }

  getAllOwnerChatsByOfferId(offerId: number): Promise<any[]> {
    return this.http.get<any>(`offer/chat/owner/${offerId}`)
      .toPromise();
  }

  sendMessageToChat(message: any, offerId: number, bidderId: number = null) {
    let params;
    if (bidderId){
      params = new HttpParams().set("bidderId", String(bidderId));
    }
    return this.http.post<any>(`offer/chat/${offerId}`, {message}, {params: params});
  }
}
