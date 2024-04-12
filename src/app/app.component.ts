import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { CharacterService } from './service/character.service';
import { CookieService } from 'ngx-cookie-service';
import { filter } from 'rxjs';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, HttpClientModule, HeaderComponent],
    providers:[CharacterService, CookieService],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent{
    titleRoute: string;
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);
    title = 'rick-and-morty-angular';

    constructor() {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
        )
            .subscribe(() => {
                let child = this.getChild(this.activatedRoute);
                child.data.subscribe((data: any) => {
                    this.titleRoute = data.title;
                })
            })
    }

    getChild(activatedRoute: ActivatedRoute): ActivatedRoute {
        if (activatedRoute.firstChild) {
            return this.getChild(activatedRoute.firstChild);
        } else {
            return activatedRoute;
        }

    }
}
