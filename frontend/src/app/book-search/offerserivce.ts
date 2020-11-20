import {Injectable} from "@angular/core";
import {HttpClient} from '@angular/common/http';
import {Offer} from "./offer";
import {BookGenre} from './book-genre';
import {EBookGenre} from './book-genre';

@Injectable()
export class OfferService {
  constructor(private http: HttpClient) { }

  getOffers() {
    return this.http.get<any>('assets/offers.json')
      .toPromise()
      .then(res => <Offer[]> res.data)
      .then(data => { return data; });
  }

  getFilteredOffers(genres?: BookGenre[] | null, author?: string | null) {
    return this.http.get<any>('assets/offers.json')
      .toPromise()
      .then(res => (<Offer[]> res.data).filter(o => this.mockFilterOffer(o, genres, author?.toUpperCase())))
      .then(data => { return data; });
  }

  /** Once BE is setup a BE filter will be used */
  private mockFilterOffer(offer: Offer, genres?: BookGenre[] | null, author?: string | null) {

    let include: Boolean = true;

    if (include && genres != null) {
      for (var g in genres) {        
        include = (Number(EBookGenre[offer.genre]) === genres[g].val);
        if (include) {
          break;
        }
      }
    }
    if (include && author != null && offer.author) {
      include = offer.author.toUpperCase().includes(author);
    }

    return include;
  }
}
