import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Store } from '../../core/services/store.service';

interface AuthenticatedUser {
  email: string;
  role: string;
}

interface CustomerOrder {
  id: number;
  status: string;
  totalCents: number;
  paymentStatus: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  readonly store = inject(Store);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  registration = false;
  name = '';
  email = '';
  password = '';
  message = '';
  busy = false;
  orders: CustomerOrder[] = [];

  submit(): void {
    if (this.busy) return;

    const email = this.email.trim();
    const password = this.password;
    const fullName = this.name.trim();
    const creatingAccount = this.registration;

    this.message = '';
    if (!email || !password || (creatingAccount && !fullName)) {
      this.message = 'Complétez tous les champs obligatoires.';
      return;
    }

    this.busy = true;
    const authentication = creatingAccount
      ? this.store.register(email, password, fullName).pipe(
          switchMap(() => this.store.login(email, password))
        )
      : this.store.login(email, password);

    // On contrôle que le cookie de session est réellement reconnu par le backend.
    authentication.pipe(
      switchMap(() => this.http.get<AuthenticatedUser>('/api/auth/me'))
    ).subscribe({
      next: user => {
        this.store.user.set(user);
        this.password = '';
        this.registration = false;
        this.busy = false;
        this.message = creatingAccount
          ? 'Votre compte a été créé. Bienvenue dans votre espace client ♡'
          : 'Vous êtes connecté à votre espace client ♡';
        this.loadOrders();
        // La route actuelle est déjà /mon-compte : le panneau client remplace le formulaire.
        void this.router.navigateByUrl('/mon-compte');
      },
      error: (error: HttpErrorResponse) => {
        this.busy = false;
        this.password = '';
        if (error.status === 409) {
          this.message = 'Cette adresse email est déjà utilisée. Connectez-vous.';
        } else if (error.status === 401) {
          this.message = creatingAccount
            ? 'Compte créé, mais la connexion automatique a échoué. Essayez de vous connecter.'
            : 'Email ou mot de passe incorrect.';
          if (creatingAccount) this.registration = false;
        } else if (error.status === 403) {
          this.message = 'La session ou la protection CSRF a été refusée. Rechargez la page et réessayez.';
        } else {
          this.message = creatingAccount
            ? 'La création ou la connexion a échoué. Vérifiez votre compte avant de recommencer.'
            : 'Impossible de vous connecter. Vérifiez que le serveur fonctionne.';
        }
      }
    });
  }

  loadOrders(): void {
    this.http.get<CustomerOrder[]>('/api/orders').subscribe({
      next: orders => this.orders = orders,
      error: () => this.message = 'Connexion établie, mais les commandes ne peuvent pas être chargées.'
    });
  }

  logout(): void {
    this.http.post('/api/auth/logout', {}).subscribe({
      next: () => {
        this.store.user.set(null);
        this.orders = [];
        this.message = '';
        this.http.get('/api/csrf').subscribe();
      },
      error: () => this.message = 'Déconnexion impossible. Réessayez.'
    });
  }
}
