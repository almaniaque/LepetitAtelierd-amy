import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface AdminOrder {
  id: number;
  totalCents: number;
  status: string;
  paymentStatus: string;
  createdAt?: string;
  user?: {
    email: string
  };
}

export interface OrderFieldChange {
  order: AdminOrder;
  previous: string;
  value: string;
}

@Component({
  selector: 'app-orders-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './orders-table.component.html',
  styleUrl: './orders-table.component.css'
})

export class OrdersTableComponent {
  @Input({
    required: true
  })
  orders: AdminOrder[] = [];

  @Input() loading = false;

  @Input() saving: number | null = null;

  @Input() error = '';

  @Output() refresh = new EventEmitter<void>();

  @Output() statusChange = new EventEmitter<OrderFieldChange>();

  @Output() paymentChange = new EventEmitter<OrderFieldChange>();

  readonly statuses = [{
    value: 'PENDING',
    label: 'En attente'
  },
  {
    value: 'ACCEPTED',
    label: 'Acceptée'
  },
  {
    value: 'MAKING',
    label: 'En fabrication'
  },
  {
    value: 'READY',
    label: 'Prête'
  },
  {
    value: 'DELIVERED',
    label: 'Livrée'
  },
  {
    value: 'CANCELLED',
    label: 'Annulée'
  }];

  readonly payments = [{
    value: 'UNPAID',
    label: 'Non payée'
  }, {
    value: 'PAID',
    label: 'Encaissée'
  }, {
    value: 'REFUNDED',
    label: 'Remboursée'
  }];
}
