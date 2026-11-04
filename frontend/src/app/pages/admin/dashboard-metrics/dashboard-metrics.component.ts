import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

export interface AdminSummary {
  revenueCents: number;
  orders: number;
  pending: number;
  inProgress: number;
  delivered: number;
}

@Component({
  selector: 'app-dashboard-metrics',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './dashboard-metrics.component.html',
  styleUrl: './dashboard-metrics.component.css'
})

export class DashboardMetricsComponent {
  @Input({ required: true }) summary!: AdminSummary;
}
