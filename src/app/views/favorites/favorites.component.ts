import { Component, OnInit, inject } from '@angular/core';
import { AlertsComponent } from '../../components/alerts/alerts.component';
import { CardsComponent } from '../../components/cards/cards.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { CookieService } from 'ngx-cookie-service';
import { characterModel } from '../../models/character.model';
import { CharacterService } from '../../service/character.service';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-favorites',
	standalone: true,
	imports: [AlertsComponent, CardsComponent, SearchBarComponent],
	templateUrl: './favorites.component.html',
	styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {

	cookieService = inject(CookieService);
	favsId: Array<number>;
	favorites: characterModel[];

	private unsubscribe = new Subject<void>;

	constructor(private characterService: CharacterService) { }

	ngOnInit(): void {
		this.getFavs();
	}

	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	getFavs(): void {
		const favsCookies = this.cookieService.get('favs');

		if (!!favsCookies) {
			this.favsId = JSON.parse(favsCookies);
			if (this.favsId && this.favsId.length > 0) {
				this.characterService.get(this.favsId).pipe(takeUntil(this.unsubscribe))
					.subscribe((characters) => {
						if (Array.isArray(characters)) {
							characters.map((mp: characterModel) => {
								mp.isFavorite = true;
							})
							this.favorites = characters;
						} else {
							let characterAux: Array<characterModel> = [];
							characterAux.push(characters as characterModel);

							characterAux[0].isFavorite = true;
							this.favorites = characterAux;
						}
					})
			}
		} else {
			this.favorites = [];
		}
	}
}
