import {Injectable} from "@angular/core";
import {HttpClient} from '@angular/common/http';
import {Offer} from "./offer";

@Injectable()
export class OfferService {
  constructor(private http: HttpClient) { }

  getOffers() {
    return this.http.get<any>('assets/offers.json')
      .toPromise()
      .then(res => <Offer[]>res.data)
      .then(data => { return data; });
  }
}
