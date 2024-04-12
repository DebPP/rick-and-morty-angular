import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { CharacterService } from './service/character.service';
import { CookieService } from 'ngx-cookie-service';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, HttpClientModule, HeaderComponent],
    providers: [CharacterService, CookieService],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    titleRoute: string;
    title = 'rick-and-morty-angular';
    
    private router = inject(Router);
    private unsubscribe = new Subject<void>;
    private activatedRoute = inject(ActivatedRoute);

    constructor() {
        this.getRoute();
    }

    getRoute(): void {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).pipe(takeUntil(this.unsubscribe))
            .subscribe(() => {
                if (this.activatedRoute.snapshot.firstChild) {
                    this.titleRoute = this.activatedRoute.snapshot.firstChild.data['title'];
                }
            })
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
