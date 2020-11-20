import {Component, OnInit} from '@angular/core';
import {BookGenre} from './book-genre';
import {Offer} from "./offer";
import {OfferService} from "./offerserivce";

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.css']
})
export class BookSearchComponent implements OnInit {

  /** Content data */
  offers: Offer[] = [];
  totalRecords: number = 0;

  /** Filter */
  bookGenres: BookGenre[];
  filterGenres?: BookGenre[] | null = null;
  filterAuthor?: string | null = null;
  filterBookName?: string | null = null;

  constructor(private productService: OfferService) {
    this.bookGenres = BookGenre.Genres;
  }

  ngOnInit() {
    this.productService.getOffers().then(data => this.offers = data);
    this.totalRecords = this.offers.length;
  }

  clearFilters() {
    this.productService.getOffers().then(data => this.offers = data);
    this.totalRecords = this.offers.length;

    this.filterGenres = null;
    this.filterAuthor = null;
  }

  performFilters() {
    if (this.isAnyFilterActive()) {
      this.productService.getFilteredOffers(this.filterGenres, this.filterAuthor).then(data => this.offers = data);
      this.totalRecords = this.offers.length;
    }
    else {
      this.clearFilters();
    }
  }

  isAnyFilterActive() {
    return this.filterGenres != null || this.filterAuthor != null || this.filterBookName != null;
  }
}
