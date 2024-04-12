import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss'
})
export class HeaderComponent {

	@Input() titleRoute: string;
	cookieService = inject(CookieService);
	activatedRoute = inject(ActivatedRoute);
	router = inject(Router);

	getFavsLength(): number {
		let favsCookies = this.cookieService.get('favs');
		if (favsCookies !== "") {
			let favs = JSON.parse(favsCookies);
			return favs.length;
		} else return 0
	}
	
    navigate(route: string): void {
        this.router.navigate([route]);
    }
}
