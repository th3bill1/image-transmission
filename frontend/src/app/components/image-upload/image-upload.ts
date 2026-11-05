import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { TranslationService } from '../../services/translation-service/translation.service';

@Component({
  imports: [CommonModule, NgOptimizedImage],
  selector: 'app-image-upload',
  templateUrl: './image-upload.html'
})
export class ImageUpload {
  protected readonly translation = inject(TranslationService);

  protected isDragActive = false;

  private dragDepth = 0;

  readonly selectedFile = input<File | null>(null);

  readonly previewUrl = input<string | null>(null);

  readonly imageDimensions = input('');

  readonly uploadError = input('');

  readonly fileSelected = output<File>();

  readonly imageDropped = output<File>();

  readonly imageCleared = output<void>();

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.fileSelected.emit(file);
    input.value = '';
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragDepth = 0;
    this.isDragActive = false;
    const file = event.dataTransfer?.files[0];
    if (file) this.imageDropped.emit(file);
  }

  protected onDragEnter(event: DragEvent): void {
    event.preventDefault();
    this.dragDepth++;
    this.isDragActive = true;
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragDepth = Math.max(0, this.dragDepth - 1);
    this.isDragActive = this.dragDepth > 0;
  }

  protected formatFileSize(size: number): string {
    return size < 1024 * 1024
      ? `${Math.ceil(size / 1024)} ${this.translation.translate('unit.kilobytes')}`
      : `${(size / (1024 * 1024)).toFixed(1)} ${this.translation.translate('unit.megabytes')}`;
  }
}
