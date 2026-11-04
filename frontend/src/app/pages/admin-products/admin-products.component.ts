import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Store } from '../../core/services/store.service';
import { AdminNavigationComponent } from '../../shared/admin-navigation/admin-navigation.component';

interface UploadedPhoto {
  imagePath: string;
}

interface NewProduct {
  name: string;
  categoryId: number | null;
  description: string;
  imagePath: string;
  priceCents: number;
  active: boolean;
}

@Component({
  standalone: true,
  selector: 'app-admin-products',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    AdminNavigationComponent
  ],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})

export class AdminProductsComponent implements OnDestroy {

  readonly store = inject(Store);

  private readonly http = inject(HttpClient);

  product: NewProduct = this.emptyProduct();

  dragOver = false;

  uploading = false;

  saving = false;

  uploadError = '';

  message = '';

  previewUrl = '';

  private localPreview = '';

  private emptyProduct(): NewProduct {
    return {
      name: '',
      categoryId: null,
      description: '',
      imagePath: '',
      priceCents: 0,
      active: true
    };
  }

  ngOnDestroy(): void {
    this.releasePreview();
  }

  onDragOver(
    event: DragEvent
  ): void {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(
    event: DragEvent
  ): void {
    event.preventDefault();
    this.dragOver = false;
  }

  onDrop(
    event: DragEvent
  ): void {
    event.preventDefault();
    this.dragOver = false;
    const file = event.dataTransfer?.files?.item(0);
    if (file) this.selectPhoto(file);
  }

  onFileChange(
    event: Event
  ): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0);
    if (file) this.selectPhoto(file);
    input.value = '';
  }

  private releasePreview(): void {
    if (
      this.localPreview
    ) URL.revokeObjectURL(
      this.localPreview
    );
    this.localPreview = '';
  }

  private selectPhoto(file: File): void {
    this.uploadError = '';
    this.message = '';

    if (![
      'image/jpeg',
      'image/png',
      'image/webp'
    ].includes(file.type)) {
      this.uploadError = 'Choisissez une photo JPG, PNG ou WebP.';
      return;
    }

    if (file.size > 5 * 1024 * 1024 || file.size === 0) {
      this.uploadError = 'La photo doit peser entre 1 octet et 5 Mo.';
      return;
    }

    if (this.uploading) return;

    this.releasePreview();

    this.localPreview = URL.createObjectURL(file);

    this.previewUrl = this.localPreview;

    this.product.imagePath = '';

    const form = new FormData();

    form.append('file', file, file.name);

    this.uploading = true;

    this.http.post<UploadedPhoto>(
      '/api/admin/media', form).pipe(finalize(() => this.uploading = false)).subscribe({
        next: response => {
          this.product.imagePath = response.imagePath;
          this.releasePreview();
          this.previewUrl = response.imagePath;
        },
        error: (error: HttpErrorResponse) => {
          this.uploadError = error.status === 413 ? 'Fichier trop volumineux (5 Mo maximum).' : error.status === 401 || error.status === 403 ? 'Session administratrice requise ou protection CSRF à vérifier.' : 'Impossible d’envoyer la photo. Vérifiez le format et le serveur.';
          this.product.imagePath = '';
          this.releasePreview();
          this.previewUrl = '';
        }
      });
  }
  setPrice(value: number | null): void {
    this.product.priceCents = Math.round((Number(value) || 0) * 100);
  }

  save(form: NgForm): void {
    this.message = '';

    if (this.saving || this.uploading) return;

    if (form.invalid || !this.product.categoryId || !this.product.imagePath || this.product.priceCents < 0) {
      this.message = 'Complétez le nom, la catégorie, un prix valide et la photo.';
      return;
    }

    this.saving = true;

    this.http.post(
      '/api/admin/products',
      this.product
    ).pipe(finalize(() => this.saving = false)).subscribe({
      next: () => {
        this.message = 'Votre création a été ajoutée à la boutique ♡';
        this.product = this.emptyProduct();
        this.releasePreview();
        this.previewUrl = '';
        form.resetForm(this.product);
        this.store.init();
      },

      error: (error: HttpErrorResponse) => {
        this.message = error.status === 403 ? 'Accès administratrice refusé.' : 'La création n’a pas pu être enregistrée. Vérifiez les informations.';
      }
    });
  }
}
