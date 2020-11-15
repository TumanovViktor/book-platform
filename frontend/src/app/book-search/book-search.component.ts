import {Component, OnInit} from '@angular/core';
import {Offer} from "./offer";
import {OfferService} from "./offerserivce";

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: []
})
export class BookSearchComponent implements OnInit {
  offers: Offer[] = [];

  constructor(private productService: OfferService) {
  }

  ngOnInit() {
    this.productService.getOffers().then(data => this.offers = data);
  }

}
