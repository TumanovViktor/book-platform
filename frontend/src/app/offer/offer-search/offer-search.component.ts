import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BookGenre, EBookGenre} from '../book-genre';
import {Offer} from "../offer";
import {OfferService} from "../offerservice";
import {prettyPrint} from '../../helper/Utils';
import {AuthenticationService} from '../../service/authentication.service';
import {UserService} from '../../service/user.service';
import {AlertService} from '../../alert';

@Component({
  selector: 'app-offer-search',
  templateUrl: './offer-search.component.html',
  styleUrls: ['./offer-search.component.scss']
})
export class OfferSearchComponent implements OnInit {

  /** Content data */
  offers: Offer[] = [];
  totalRecords;
  pageIndex: number = 1;
  pageSize: number = 5;

  /** Filter */
  panelFilterHeader: string = "Vyhledávání (žádný filtr)";
  bookGenres: BookGenre[];
  bookGenreMap: Map<EBookGenre, BookGenre>;
  filterGenres?: BookGenre[] | null;
  filterAuthor?: string | null;
  filterBookName?: string | null;
  filterRating?: number | null;
  filterFavourite?: boolean | null;
  sort?: string | null;
  sortAsc?: boolean | null;

  constructor(private offerService: OfferService, private router: Router, private authService: AuthenticationService,
              private alertService: AlertService) {
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
    if (!this.authService.currentUserValue) {
      this.alertService.error('Pouze přihlášený uživatel může označit inzerát jako oblíbeny');
      return;
    }
    offer.favourite = !offer.favourite;
    this.offerService.markAsFavourite(offer.id, offer.favourite);
  }

  performFilters(clear: boolean) {
    if (clear || !this.isAnyFilterActive()) {
      this.clearFilters();
    }

    this.offerService.getFilteredOffers(this.pageIndex, this.pageSize, this.filterGenres, this.filterAuthor, this.filterBookName,
      this.filterRating, this.filterFavourite, this.sort, this.sortAsc)
      .then(data => {
        this.offers = data.content;
        this.totalRecords = data.count;
      });

    this.setOrRemoveItemFromLocalStorage("filterGenres", this.filterGenres);
    this.setOrRemoveItemFromLocalStorage("filterAuthor", this.filterAuthor);
    this.setOrRemoveItemFromLocalStorage("filterBookName", this.filterBookName);
    this.setOrRemoveItemFromLocalStorage("filterRating", this.filterRating);
    this.setOrRemoveItemFromLocalStorage("filterFavourite", this.filterFavourite);

    this.modifyFilterPanelHeader();
  }

  private clearFilters() {
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

  paginate(event) {
    this.pageIndex = event.first/event.rows + 1;
    this.sort = event.sortField;
    this.sortAsc = event.sortOrder === 1;
    this.performFilters(false);
  }
}
