import { Component, EventEmitter, Input, Output, inject, } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CharacterService } from '../../service/character.service';
import { characterModel } from '../../models/character.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';


@Component({
	selector: 'app-search-bar',
	standalone: true,
	imports: [FormsModule, ReactiveFormsModule],
	templateUrl: './search-bar.component.html',
	styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
	@Input() showSearch = true;
	@Output() resultSeach: EventEmitter<Array<characterModel>> = new EventEmitter();
	form: FormGroup;
	searchResult: Array<characterModel>
	showSearchPopUp = false;
	title: string;
	target = false;
	showClearInputBtn = false;

	private formBuilder = inject(FormBuilder);
	private service = inject(CharacterService);
	router = inject(Router);
	activatedRoute = inject(ActivatedRoute);

	constructor() {
		this.router.events.pipe(
			filter(event => event instanceof NavigationEnd),
		)
			.subscribe(() => {
				var rt = this.getChild(this.activatedRoute);
				rt.data.subscribe((data: any) => {
					this.title = data.title;
				})
			})

		this.form = this.formBuilder.group({
			itemPesquisa: ['']
		});

		if (this.form) {
			if (this.form.get('itemPesquisa')) {

				const variable = this.form.get('itemPesquisa')

				variable!.valueChanges
					.subscribe(res => {
						this.showClearInputBtn = true;
						if (res.length > 2 && !this.target) {
							this.onSearch(res);
						} else if (res.length === 0) {
							this.showSearchPopUp = false;
							this.resultSeach.emit(this.searchResult);
						}
					})
			}
		}

	}

	getChild(activatedRoute: ActivatedRoute): any {
		if (activatedRoute.firstChild) {
			return this.getChild(activatedRoute.firstChild);
		} else {
			return activatedRoute;
		}

	}

	onSearch(name: string): void {
		this.service.filter(name).subscribe(
			res => {
				this.searchResult = res.results;
				this.showSearchPopUp = true;
			}
		)

	}

	onClearInput(): void {
		this.form.get('itemPesquisa')?.setValue("");
		this.showClearInputBtn = false;
		this.target = false;
	}

	onSelectItem(character: characterModel, event: Event) {
		this.showSearchPopUp = false;
		this.target = true;
		this.form.get('itemPesquisa')?.setValue(character.name);
		this.resultSeach.emit(this.searchResult);
		this.searchResult = [];
	}

	navigate(route: string): void {
		this.router.navigate([route]);
	}

}
