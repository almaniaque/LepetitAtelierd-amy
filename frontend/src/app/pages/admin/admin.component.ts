import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Store } from '../../core/services/store.service';
@Component({
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.css'
})
export class AdminComponent {
    store = inject(Store);
    private http = inject(HttpClient);
    orders: any[] = [];
    summary: any = { revenueCents: 0, orders: 0, pending: 0, inProgress: 0, delivered: 0 };
    message = '';
    newProduct: any = { name: '', categoryId: null, description: '', imagePath: '', priceCents: 0, active: true };
    constructor() { this.load(); }
    load() { this.http.get<any[]>('/api/admin/orders').subscribe({ next: x => this.orders = x }); this.http.get<any>('/api/admin/summary').subscribe({ next: x => this.summary = x }); }
    change(o: any) { this.http.patch('/api/admin/orders/' + o.id + '/status', { status: o.status }).subscribe({ next: () => this.load() }); }
    pay(o: any) { this.http.patch('/api/admin/orders/' + o.id + '/payment', { paymentStatus: o.paymentStatus }).subscribe({ next: () => this.load() }); }
    create() { this.http.post('/api/admin/products', this.newProduct).subscribe({ next: () => { this.message = 'Création enregistrée.'; this.store.init(); }, error: () => this.message = 'Erreur : vérifiez les données.' }); }
}

