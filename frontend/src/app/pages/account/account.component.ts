import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Store } from '../../core/services/store.service';
@Component({
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './account.component.html',
    styleUrl: './account.component.css'
})
export class AccountComponent {
    store = inject(Store);
    private http = inject(HttpClient);
    registration = false;
    name = '';
    email = '';
    password = '';
    message = '';
    orders: any[] = [];
    submit() { const request = this.registration ? this.store.register(this.email, this.password, this.name) : this.store.login(this.email, this.password); request.subscribe({ next: (u: any) => { if (this.registration) {
            this.registration = false;
            this.message = 'Compte créé. Connectez-vous maintenant.';
        }
        else {
            this.store.user.set(u);
            this.loadOrders();
            this.message = '';
        } this.password = ''; }, error: () => this.message = 'Impossible de valider la demande. Vérifiez les informations.' }); }
    loadOrders() { this.http.get<any[]>('/api/orders').subscribe({ next: x => this.orders = x }); }
    logout() { this.store.logout().subscribe({ next: () => { this.store.user.set(null); this.orders = []; this.http.get('/api/csrf').subscribe(); } }); }
}

