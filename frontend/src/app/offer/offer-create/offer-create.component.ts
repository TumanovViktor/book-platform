import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BookGenre, EBookGenre} from '../book-genre';
import {Offer} from "../offer";
import {User} from "../../model/user";
import {OfferService} from "../offerservice";
import {AuthenticationService} from "../../service/authentication.service";
import {AlertService} from "../../alert";

@Component({
  selector: 'app-offer-create',
  templateUrl: './offer-create.component.html',
  styleUrls: ['./offer-create.component.scss']
})
export class OfferCreateComponent implements OnInit {

  offer: Offer = {} as Offer;

  bookGenres: BookGenre[];
  bookGenreMap: Map<EBookGenre, BookGenre>;

  authenticatedUser: User;

  constructor(
    private offerService: OfferService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.authenticationService.currentUser.subscribe(user => {
      if (!user) {
        this.router.navigate([`/login`]);
        this.alertService.error('Pro vytvoření inzerátu je nutné se přihlásit.');
        return;
      }
      this.authenticatedUser = user;
    });
    this.bookGenres = Array.from(BookGenre.GenreMap.values());
    this.bookGenreMap = BookGenre.GenreMap;
  }

  ngOnInit() {
    if (localStorage.getItem('wipOffer')) {
      this.offer = JSON.parse(localStorage.getItem('wipOffer'));
    }
  }

  save() {
    console.log(this.offer);

    this.offerService.save(this.offer)
      .then(savedOffer => {
        localStorage.removeItem('wipOffer');
        this.router.navigate([`/detail/${savedOffer.id}`]);
      });
  }

  updateLocalStorage() {
    localStorage.setItem('wipOffer', JSON.stringify(this.offer))
  }
}
