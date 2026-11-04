import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store, Product, Option } from '../../core/services/store.service';
@Component({
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './catalog.component.html',
    styleUrl: './catalog.component.css'
})
export class CatalogComponent {
    store = inject(Store);
    category = signal('');
    message = signal('');
    choices: Record<string, number | null> = {};
    private route = inject(ActivatedRoute);
    constructor() { this.route.queryParamMap.subscribe(x => this.category.set(x.get('c') || '')); }
    visible = computed(() => this.store.products().filter(p => !this.category() || p.category.slug === this.category()));
    kinds(p: Product) { return [...new Set(p.options.map(o => o.kind))]; }
    options(p: Product, kind: string) { return p.options.filter(o => o.kind === kind); }
    selected(id: number, kind: string) { return this.choices[id + ':' + kind] ?? null; }
    setOption(id: number, kind: string, value: number | null) { this.choices[id + ':' + kind] = value; }
    selectedColor(p: Product) { const id = this.selected(p.id, 'Couleur'); return p.options.find(o => o.id === id)?.label ?? ''; }
    previewImage(p: Product) { const id = this.selected(p.id, 'Couleur'); return p.options.find(o => o.id === id)?.imagePath || p.imagePath || '/assets/images/creations/bouquet-artisanal-2.webp'; }
    colorHex(label: string) { const colors: Record<string, string> = { 'Orange': 'var(--swatch-orange)', 'Vert sauge': 'var(--swatch-sage)', 'Vert menthe': 'var(--swatch-menthe)', 'Crème': 'var(--swatch-creme)', 'Rose intense': 'var(--swatch-rose-intense)', 'Rose poudré': 'var(--swatch-rose-poudre)', 'Pêche': 'var(--swatch-peche)', 'Rouge': 'var(--swatch-rouge)', 'Lavande': 'var(--swatch-lavande)', 'Beige': 'var(--swatch-beige)' }; return colors[label] ?? 'var(--swatch-default)'; }
    add(p: Product) { const chosen: Option[] = []; for (const k of this.kinds(p)) {
        const id = this.selected(p.id, k);
        if (!id) {
            this.message.set('Choisissez « ' + k + ' » pour ' + p.name + '.');
            return;
        }
        const op = p.options.find(o => o.id === id);
        if (op)
            chosen.push(op);
    } this.store.add(p, chosen); this.message.set(p.name + ' ajouté au panier ♡'); }
}

