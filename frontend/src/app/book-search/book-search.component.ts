import {Component, OnInit} from '@angular/core';
import {BookGenre, EBookGenre} from './book-genre';
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
  readonly stg: string = "Vyhledávání (žádný filtr)";
  panelFilterHeader: string = "Vyhledávání (žádný filtr)";
  bookGenres: BookGenre[];
  bookGenreMap: Map<EBookGenre, BookGenre>;
  filterGenres?: BookGenre[] | null;
  filterAuthor?: string | null;
  filterBookName?: string | null;
  filterRating?: number | null;

  constructor(private productService: OfferService) {
    this.bookGenres = Array.from(BookGenre.GenreMap.values());
    this.bookGenreMap = BookGenre.GenreMap;

    this.filterGenres = JSON.parse(localStorage.getItem("filterGenres")!);
    this.filterAuthor = JSON.parse(localStorage.getItem("filterAuthor")!);
    this.filterBookName = JSON.parse(localStorage.getItem("filterBookName")!);
    this.filterRating = JSON.parse(localStorage.getItem("filterRating")!);

    this.modifyFilterPanelHeader();
  }

  ngOnInit() {
    this.productService.getFilteredOffers(this.filterGenres, this.filterAuthor, this.filterBookName, this.filterRating)
      .then(data => this.offers = data);
    this.totalRecords = this.offers.length;
  }

  performFilters(clear: boolean) {
    if (clear || !this.isAnyFilterActive()) {
      this.clearFilters();
    }
    else {
      this.productService.getFilteredOffers(this.filterGenres, this.filterAuthor, this.filterBookName, this.filterRating)
        .then(data => this.offers = data);
      this.totalRecords = this.offers.length;
    }

    this.setOrRemoveItemFromLocalStorage("filterGenres", this.filterGenres);
    this.setOrRemoveItemFromLocalStorage("filterAuthor", this.filterAuthor);
    this.setOrRemoveItemFromLocalStorage("filterBookName", this.filterBookName);
    this.setOrRemoveItemFromLocalStorage("filterRating", this.filterRating);

    this.modifyFilterPanelHeader();
  }

  private clearFilters() {
    this.productService.getOffers().then(data => this.offers = data);
    this.totalRecords = this.offers.length;

    this.filterGenres = null;
    this.filterAuthor = null;
    this.filterBookName = null;
    this.filterRating = null;
  }

  private modifyFilterPanelHeader() {
    let panelFilterMsg;
    let activeFilterCount = this.countActiveFilters();
    if (activeFilterCount > 0) {
      panelFilterMsg = `${activeFilterCount} ${activeFilterCount == 1 ? "filtr" : "filtry"} aktivní`;
    }
    else {
      panelFilterMsg = "žádný filtr";
    }
    this.panelFilterHeader = `Vyhledávání (${panelFilterMsg})`;
  }

  private isAnyFilterActive(): boolean {
    return (this.filterGenres != null && this.filterGenres.length > 0)
      || this.filterAuthor != null || this.filterBookName != null || this.filterRating != null;
  }

  private countActiveFilters(): number {
    let i: number = 0;
    if (this.filterGenres != null) {
      i++;
    }
    if (this.filterAuthor != null) {
      i++;
    }
    if (this.filterBookName != null) {
      i++;
    }
    if (this.filterRating != null) {
      i++;
    }
    return i;
  }

  private setOrRemoveItemFromLocalStorage(itemName: string, val: any) {
    if (val != null || (Array.isArray(val) && val.length > 0)) {
      localStorage.setItem(itemName, JSON.stringify(val));
    }
    else {
      localStorage.removeItem(itemName);
    }
  }
}
