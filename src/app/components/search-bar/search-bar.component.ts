import { Component, EventEmitter, Input, OnInit, Output, inject, } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CharacterService } from '../../service/character.service';
import { characterModel } from '../../models/character.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, debounceTime, filter, takeUntil } from 'rxjs';

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
	searchResult: Array<characterModel>;
	title: string;
	showClearInputBtn = false;

	private searchSubject = new Subject<string>();
	private readonly debounceTimeMs = 300;
	private unsubscribe = new Subject<void>;

	private formBuilder = inject(FormBuilder);
	private service = inject(CharacterService);
	private router = inject(Router);
	private activatedRoute = inject(ActivatedRoute);

	constructor() {
		this.router.events.pipe(
			filter(event => event instanceof NavigationEnd),
		)
			.subscribe(() => {
				let child = this.getChild(this.activatedRoute);
				child.data.subscribe((data: any) => {
					this.title = data.title;
				})
			})

		this.form = this.formBuilder.group({
			itemPesquisa: ['']
		});

		this.form.get('itemPesquisa')!.valueChanges
		.pipe(debounceTime(this.debounceTimeMs), takeUntil(this.unsubscribe))
			.subscribe(searchValue => {
				this.showClearInputBtn = true;
				this.performSearch(searchValue);
				if (searchValue.length === 0) {
					this.resultSeach.emit(this.searchResult);
				}
			})
	}

	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.searchSubject.complete();
	}

	getChild(activatedRoute: ActivatedRoute): ActivatedRoute {
		if (activatedRoute.firstChild) {
			return this.getChild(activatedRoute.firstChild);
		} else {
			return activatedRoute;
		}

	}

	performSearch(name: string): void {
		this.service.filter(name)
			.pipe(debounceTime(this.debounceTimeMs))
			.subscribe(response => {
				this.searchResult = response.results;
				this.resultSeach.emit(response.results);
			})
	}

	onClearInput(): void {
		this.form.get('itemPesquisa')?.setValue("");
		this.showClearInputBtn = false;
	}

	navigate(route: string): void {
		this.router.navigate([route]);
	}
}
