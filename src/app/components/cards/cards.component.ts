import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { characterModel } from '../../models/character.model';
import { CookieService } from 'ngx-cookie-service';

@Component({
	selector: 'app-cards',
	standalone: true,
	imports: [],
	templateUrl: './cards.component.html',
	styleUrl: './cards.component.scss'
})
export class CardsComponent implements OnInit {
	@Input() data: Array<characterModel>;
	@Output() changeFav: EventEmitter<any> = new EventEmitter();
	cookieService = inject(CookieService);
	favorites: Array<number> = [];

	ngOnInit(): void {
		this.getAllFavs();
	}

	onSaveFavorite(char: characterModel): void {
		if (this.favorites.length === 0) {
			this.getAllFavs();
		}

		this.favorites.push(char.id);
		char.isFavorite = true;

		const favs_str = JSON.stringify(this.favorites);
		this.cookieService.set('favs', favs_str);
	}

	getAllFavs(): void {
		const favsCookies = this.cookieService.get('favs');
		if (!!favsCookies) {
			let aux = JSON.parse(favsCookies);
			this.favorites = this.favorites.concat(aux);

			if(!!this.data) {
				this.favorites.forEach(fvs => {
					this.data.map(dt => {
						if (dt.id === fvs) {
		
							dt.isFavorite = true
		
						}
					})
				})

			}
		}
	}

	onRemoveFavorite(char: characterModel): void {
		this.cookieService.delete('favs');
		let i = this.favorites.indexOf(char.id)
		this.favorites.splice(i, 1);
		char.isFavorite = false;

		const favs_str = JSON.stringify(this.favorites);
		this.cookieService.set('favs', favs_str);

		this.changeFav.emit();
	}
}
