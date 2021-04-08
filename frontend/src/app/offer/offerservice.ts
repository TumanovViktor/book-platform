import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from '@angular/common/http';
import {Offer} from "./offer";
import {BookGenre} from './book-genre';

@Injectable()
export class OfferService {
  constructor(private http: HttpClient) { }

  getOffers(pageSize) {
    let params = new HttpParams().set("pNo", "1")
      .set("pSize", String(pageSize))

    return this.http.get<any>('offer', {params: params})
      .toPromise();
  }

  getFilteredOffers(pageIndex?: number | null, pageSize?: number, genres?: BookGenre[] | null, author?: string | null, bookName?: string | null,
      rating?: number | null, favourite?: boolean | null) {
    let params = new HttpParams().set("pNo", String(pageIndex))
      params = params.set("pSize", String(pageSize))
    // .set("cSort", )
    // .set("cSortAsc", )
    params = !!genres ? params.set("fGenre", genres.map(genre => genre.val).join(",")) : params;
    params = !!rating ? params.set("fRating", String(rating)) : params;
    params = !!favourite ? params.set("fFav", String(favourite)) : params;
    params = !!bookName ? params.set("fBookName", bookName) : params;
    params = !!author ? params.set("fAuthor", author) : params;
    return this.http.get<any>('offer', {params}).toPromise();
  }

  getOfferById(id: number) {
    // let params = new HttpParams().set("id", String(id));
    return this.http.get<any>(`offer/${id}`)
      .toPromise();
  }

  save(offer: Offer): Promise<any> {
    if (!offer) {
      return null;
    }
    return this.http.post('offer', offer).toPromise();
  }

  markAsFavourite(offerId: number, fav: boolean) {
    let params = new HttpParams().set("fav", String(fav));
    return this.http.put<any>(`/offer/${offerId}/favourite`, {params}).subscribe();
  }
}
