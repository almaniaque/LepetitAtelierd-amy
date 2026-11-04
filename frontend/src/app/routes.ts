import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { CartComponent } from './pages/cart/cart.component';
import { AccountComponent } from './pages/account/account.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminProductsComponent } from './pages/admin-products/admin-products.component';
import { LegalComponent } from './pages/legal/legal.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'boutique',
        component: CatalogComponent
    },
    {
        path: 'panier',
        component: CartComponent
    },
    {
        path: 'mon-compte',
        component: AccountComponent
    },
    {
        path: 'administration',
        component: AdminComponent
    },
    {
        path: 'administration/produits',
        component: AdminProductsComponent
    },
    {
        path: 'legal/:page',
        component: LegalComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];
