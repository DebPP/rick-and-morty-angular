import { Component, OnInit, inject } from '@angular/core';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';


import { CommonModule } from '@angular/common';
import { AlertsComponent } from '../../components/alerts/alerts.component';
import { CharacterService } from '../../service/character.service';
import { dataModel } from '../../models/data.model';
import { characterModel } from '../../models/character.model';
import { CardsComponent } from '../../components/cards/cards.component';
import { CookieService } from 'ngx-cookie-service';

@Component({
	selector: 'app-start',
	standalone: true,
	imports: [SearchBarComponent, CommonModule, AlertsComponent, CardsComponent],
	providers: [CharacterService],
	templateUrl: './start.component.html',
	styleUrl: './start.component.scss'
})
export class StartComponent implements OnInit {
	data: dataModel;
	characters: Array<characterModel> = [];
	favorites: Array<characterModel> = [];
	isFavorite: boolean = false;
	cookieService = inject(CookieService);
	page = 1;
	showPagination = true;

	constructor(private service: CharacterService) { }

	ngOnInit(): void {
		this.populateCharacter(this.page);
	}

	populateCharacter(page: number): void {
		this.service.getAll(page)
			.subscribe(res => {
				this.onMarkfavs(res.results);
				this.characters = this.characters.concat(res.results);
			})
	}

	onMarkfavs(res: characterModel[]): void {
		const favsCookies = this.cookieService.get('favs');
		if (!!favsCookies) {
			const favs = JSON.parse(favsCookies);

			favs.forEach((fv: number) => {
				res.map(rs => {
					if (rs.id == fv) {
						rs.isFavorite = true;
					}
				});
			});
		}
	}

	onChangeSearch(charactersSearch: Array<characterModel>): void {
		this.showPagination = false;
		if (charactersSearch.length === 0) {
			this.characters = [];
			this.populateCharacter(this.page = 1);
		} else {
			this.onMarkfavs(charactersSearch);
			this.characters = charactersSearch;
		}
	}
}
