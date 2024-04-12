import { Routes } from '@angular/router';
import { StartComponent } from './views/start/start.component';
import { FavoritesComponent } from './views/favorites/favorites.component';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'search',
		pathMatch: 'full'
	},
	{
		path: 'search',
		component: StartComponent,
		data: { title: 'Início' },
		title: 'Rick and Morty - Início'
	},
	{
		path: 'favorites',
		component: FavoritesComponent,
		data: { title: 'Favoritos' },
		title: 'Rick and Morty - Favoritos'
	}
];
