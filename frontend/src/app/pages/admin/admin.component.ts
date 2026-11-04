import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Store } from '../../core/services/store.service';
import { AdminNavigationComponent } from '../../shared/admin-navigation/admin-navigation.component';
import { DashboardMetricsComponent, AdminSummary } from './dashboard-metrics/dashboard-metrics.component';
import { OrdersTableComponent, AdminOrder, OrderFieldChange } from './orders-table/orders-table.component';
@Component({ selector: 'app-admin', standalone: true, imports: [CommonModule, RouterLink, AdminNavigationComponent, DashboardMetricsComponent, OrdersTableComponent], templateUrl: './admin.component.html', styleUrl: './admin.component.css' })
export class AdminComponent implements OnInit {

    readonly store = inject(Store);

    private readonly http = inject(HttpClient);

    orders: AdminOrder[] = [];

    summary: AdminSummary = {
        revenueCents: 0,
        orders: 0,
        pending: 0,
        inProgress: 0,
        delivered: 0
    };

    loading = false;

    error = '';

    saving: number | null = null;

    ngOnInit(): void {
        if (this.store.user()?.role === 'ROLE_ADMIN') this.load();
    }

    load(): void {
        this.loading = true;
        this.error = '';
        this.http.get<AdminSummary>(
            '/api/admin/summary').subscribe({
                next: data => {
                    this.summary = data;
                    this.loading = false;
                },
                error: () => {
                    this.error = 'Impossible de récupérer les indicateurs.';
                    this.loading = false;
                }
            });

        this.http.get<AdminOrder[]>(
            '/api/admin/orders').subscribe({
                next: data => this.orders = data,
                error: () => {
                    this.error = 'Impossible de récupérer les commandes.';
                    this.loading = false;
                }
            });
    }
    updateStatus({
        order,
        previous,
        value
    }:
        OrderFieldChange
    ): void {
        if (value === previous) return;
        this.saving = order.id;
        this.http.patch(
            '/api/admin/orders/' + order.id + '/status',
            {
                status: value
            }).subscribe({
                next: () => {
                    order.status = value;
                    this.saving = null;
                    this.load();
                },
                error: () => {
                    order.status = previous;
                    this.saving = null;
                    this.error = 'La modification de la commande a échoué.';
                }
            });
    }

    updatePayment({ order, previous, value }: OrderFieldChange): void {
        if (value === previous) return;
        this.saving = order.id;
        this.http.patch(
            '/api/admin/orders/' + order.id + '/payment',
            {
                paymentStatus: value
            }).subscribe({
                next: () => {
                    order.paymentStatus = value;
                    this.saving = null;
                    this.load();
                }, error: () => {
                    order.paymentStatus = previous;
                    this.saving = null;
                    this.error = 'La modification du paiement a échoué.';
                }
            });
    }
}
