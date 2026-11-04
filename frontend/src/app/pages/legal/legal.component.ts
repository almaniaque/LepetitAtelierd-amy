import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { legal } from '../../core/data/legal.data';
@Component({
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './legal.component.html',
    styleUrl: './legal.component.css'
})
export class LegalComponent {

    private route = inject(ActivatedRoute);

    get doc() {
        return legal[this.route.snapshot.paramMap.get('page') || 'mentions'];
    }
}

