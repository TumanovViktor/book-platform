import { OfferChatMsg } from './offer-chat-msg';

export interface OfferChat {
  byUserId: number;
  byUserName: string;
  offerId: number;
  msgs: OfferChatMsg[];
}
