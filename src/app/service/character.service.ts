import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { dataModel } from '../models/data.model';
import { characterModel } from '../models/character.model';

@Injectable({
	providedIn: 'root'
})
export class CharacterService {

	private http = inject(HttpClient);

	getAll(page?: number): Observable<dataModel> {
		return this.http.get<dataModel>('https://rickandmortyapi.com/api/character/?page=' + page)
	}

	filter(name: string): Observable<dataModel> {
		return this.http.get<dataModel>('https://rickandmortyapi.com/api/character/?name=' + name)
	}

	get(ids: Array<number>): Observable<any> {
		return this.http.get<Array<characterModel>>('https://rickandmortyapi.com/api/character/' + ids)
	}
}
