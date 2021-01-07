import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BookGenre, EBookGenre} from '../book-genre';
import {Offer} from "../offer";
import {OfferService} from "../offerservice";

@Component({
  selector: 'app-offer-search',
  templateUrl: './offer-search.component.html',
  styleUrls: ['./offer-search.component.scss']
})
export class OfferSearchComponent implements OnInit {

  /** Content data */
  offers: Offer[] = [];
  totalRecords: number = 0;

  /** Filter */
  panelFilterHeader: string = "Vyhledávání (žádný filtr)";
  bookGenres: BookGenre[];
  bookGenreMap: Map<EBookGenre, BookGenre>;
  filterGenres?: BookGenre[] | null;
  filterAuthor?: string | null;
  filterBookName?: string | null;
  filterRating?: number | null;
  filterFavourite?: boolean | null;

  constructor(private offerService: OfferService, private router: Router) {
    this.bookGenres = Array.from(BookGenre.GenreMap.values());
    this.bookGenreMap = BookGenre.GenreMap;

    this.filterGenres = JSON.parse(localStorage.getItem("filterGenres")!);
    this.filterAuthor = JSON.parse(localStorage.getItem("filterAuthor")!);
    this.filterBookName = JSON.parse(localStorage.getItem("filterBookName")!);
    this.filterRating = JSON.parse(localStorage.getItem("filterRating")!);
    this.filterFavourite = JSON.parse(localStorage.getItem("filterFavourite")!);

    this.modifyFilterPanelHeader();
  }

  ngOnInit() {
    this.performFilters(false);
  }

  goToOfferDetail(offer: Offer) {
    this.router.navigate([`/detail/${offer.id}`]);
  }

  markAsFavourite(offer: Offer) {
    // TODO call BE to favourite offer
    offer.favourite = !offer.favourite;
  }

  performFilters(clear: boolean) {
    if (clear || !this.isAnyFilterActive()) {
      this.clearFilters();
    }
    else {
      this.offerService.getFilteredOffers(this.filterGenres, this.filterAuthor, this.filterBookName,
          this.filterRating, this.filterFavourite)
        .then(data => this.offers = data);
      this.totalRecords = this.offers.length;
    }

    this.setOrRemoveItemFromLocalStorage("filterGenres", this.filterGenres);
    this.setOrRemoveItemFromLocalStorage("filterAuthor", this.filterAuthor);
    this.setOrRemoveItemFromLocalStorage("filterBookName", this.filterBookName);
    this.setOrRemoveItemFromLocalStorage("filterRating", this.filterRating);
    this.setOrRemoveItemFromLocalStorage("filterFavourite", this.filterFavourite);

    this.modifyFilterPanelHeader();
  }

  private clearFilters() {
    this.offerService.getOffers().then(data => this.offers = data);
    this.totalRecords = this.offers.length;

    this.filterGenres = null;
    this.filterAuthor = null;
    this.filterBookName = null;
    this.filterRating = null;
    this.filterFavourite = null;
  }

  private modifyFilterPanelHeader() {
    let panelFilterMsg;
    let activeFilterCount = this.countActiveFilters();
    if (activeFilterCount > 0) {
      let activeFilterNoun;
      if (activeFilterCount == 1) {
        activeFilterNoun = "aktivní filtr";
      }
      else if (activeFilterCount < 4) {
        activeFilterNoun = "aktivní filtry";
      }
      else {
        activeFilterNoun = "aktivních filtrů";
      }
      panelFilterMsg = `${activeFilterCount} ${activeFilterNoun}`;
    }
    else {
      panelFilterMsg = "žádný filtr";
    }
    this.panelFilterHeader = `Vyhledávání (${panelFilterMsg})`;
  }

  private isAnyFilterActive(): boolean {
    return (this.filterGenres != null && this.filterGenres.length > 0)
      || this.filterAuthor != null || this.filterBookName != null || this.filterRating != null
      || this.filterFavourite != null;
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
    if (this.filterFavourite != null) {
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
