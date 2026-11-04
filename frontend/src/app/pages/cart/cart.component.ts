import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Store, Option } from '../../core/services/store.service';
@Component({
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.css'
})

export class CartComponent {
    store = inject(Store);
    private router = inject(Router);
    note = '';
    accepts = false;
    busy = false;
    message = '';
    lineImage(
        options: Option[],
        fallback: string
    ) {
        return options.find(o => o.kind === 'Couleur' && o.imagePath)?.imagePath || fallback;
    };

    labels(o: Option[]) {
        return o.map(x => x.kind + ': ' + x.label).join(' · ');
    }

    extra(o: Option[]) {
        return o.reduce((s, x) => s + x.extraCents, 0);
    }

    order() {
        this.busy = true;
        this.store.checkout(
            this.note,
            this.accepts
        ).subscribe({
            next: () => {
                this.store.clear();
                this.message = 'Votre demande a bien été enregistrée ♡';
                this.busy = false;
            },
            error: e => {
                this.busy = false;
                this.message = e.status === 401 || e.status === 403 ? 'Connectez-vous dans Mon compte avant de commander.' : 'Impossible d’enregistrer la commande. Réessayez.';
            }
        });
    }
}

