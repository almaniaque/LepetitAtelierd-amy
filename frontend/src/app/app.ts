import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Store } from './core/services/store.service';
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterLink, RouterOutlet],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class AppComponent implements OnInit {
    store = inject(Store);
    ngOnInit() { this.store.init(); }
}

