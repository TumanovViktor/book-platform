import {Injectable} from "@angular/core";
import {HttpClient} from '@angular/common/http';
import {Offer} from "./offer";
import {BookGenre} from './book-genre';

@Injectable()
export class OfferService {
  constructor(private http: HttpClient) { }

  getOffers() {
    return this.http.get<any>('assets/offers.json')
      .toPromise()
      .then(res => <Offer[]> res.data);
  }

  getFilteredOffers(genres?: BookGenre[] | null, author?: string | null, bookName?: string | null,
      rating?: number | null, favourite?: boolean | null) {
    return this.http.get<any>('assets/offers.json')
      .toPromise()
      .then(res => (<Offer[]> res.data)
        .filter(o => this.mockFilterOffer(o, genres, author?.toUpperCase(), bookName?.toUpperCase(), rating, favourite)));
  }

  getOfferById(id: number) {
    return this.http.get<any>('assets/offers.json')
      .toPromise()
      .then(res => (<Offer[]> res.data)
        .find(o => { return o.id === id; }));
  }

  save(offer: Offer): Promise<Offer> {
    if (!offer) {
      return null;
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        offer.id = 1; // simulating save on backend
        offer.createdDate = new Date().toISOString();

        resolve(offer);
      }, 1000);
    });
  }

  /** Once BE is setup a BE filter will be used */
  private mockFilterOffer(offer: Offer, genres?: BookGenre[] | null, author?: string | null,
      bookName?: string | null, rating?: number | null, favourite?: boolean | null) {

    let include: Boolean = true;

    if (include && genres != null) {
      for (var g of genres) {
        include = offer.genre === g.val;
        if (include) {
          break;
        }
      }
    }
    if (include && author != null && offer.author) {
      include = offer.author.toUpperCase().includes(author);
    }
    if (include && bookName != null) {
      include = offer.bookName.toUpperCase().includes(bookName);
    }
    if (include && rating && offer.rating != null) {
      include = offer.rating >= rating;
    }
    if (include && favourite != null) {
      include = offer.favourite === favourite;
    }
    return include;
  }
}
