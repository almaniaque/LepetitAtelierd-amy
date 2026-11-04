import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from './core/services/store.service';
import { AnnouncementComponent } from './shared/announcement/announcement.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        AnnouncementComponent,
        HeaderComponent,
        FooterComponent
    ],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class AppComponent implements OnInit {

    private readonly store = inject(Store);
    ngOnInit(): void {
        this.store.init();
    }
}
