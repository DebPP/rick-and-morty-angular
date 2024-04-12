import { Component, OnInit, inject } from '@angular/core';
import { AlertsComponent } from '../../components/alerts/alerts.component';
import { CardsComponent } from '../../components/cards/cards.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { CookieService } from 'ngx-cookie-service';
import { characterModel } from '../../models/character.model';
import { CharacterService } from '../../service/character.service';
import { map } from 'rxjs/operators';
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

	constructor(private characterService: CharacterService) {
	}
	ngOnInit(): void {
		this.getFavs();
	}

	getFavs(): void {
		const favsCookies = this.cookieService.get('favs');

		if (!!favsCookies) {
			this.favsId = JSON.parse(favsCookies);
			if (this.favsId.length > 0) {
				this.characterService.get(this.favsId)
					.subscribe(res => {
						if (res.length > 1) {
							res.map((mp: characterModel) => {
								mp.isFavorite = true;
							})
							this.favorites = res;
						} else {
							let aux: Array<characterModel> = [];
							res.isFavorite = true;
							aux = aux.concat(res);
							this.favorites = aux;
						}
					})
			}
		} else {
			this.favorites = [];
		}
	}
}
