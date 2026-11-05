import { Component, OnDestroy, inject, signal } from '@angular/core';
import { AppHeader } from './components/app-header/app-header';
import { ImageUpload } from './components/image-upload/image-upload';
import {
  SimulationPhase,
  SimulationResult
} from './components/simulation-result/simulation-result';
import {
  CodecOption,
  SimulationControls
} from './components/simulation-controls/simulation-controls';
import { TranslationService } from './services/translation-service/translation.service';
import { ImageService } from './services/image-service/image.service';

@Component({
  imports: [AppHeader, ImageUpload, SimulationControls, SimulationResult],
  selector: 'app-root',
  templateUrl: './app.html',
  host: {
    '[class.dark-theme]': 'isDarkMode'
  }
})
export class App implements OnDestroy {
  private readonly translation = inject(TranslationService);

  private readonly imageService = inject(ImageService);

  isDarkMode = false;

  protected readonly selectedFile = signal<File | null>(null);

  protected readonly previewUrl = signal<string | null>(null);

  protected readonly isUploading = signal(false);

  protected readonly imageDimensions = signal('');

  protected readonly uploadError = signal('');

  protected readonly simulationMessage = signal('');

  protected codec = 'hamming74';

  protected noiseModel = 'independent';

  protected errorProbability = 0.01;

  protected burstLength = 8;

  protected burstCount = 1;

  protected randomSeed: number | null = null;

  protected readonly simulationPhase = signal<SimulationPhase | null>(null);

  private simulationTimer: ReturnType<typeof setTimeout> | null = null;

  protected get codecOptions(): readonly CodecOption[] {
    return [
      {
        value: 'uncoded',
        label: this.translation.translate('codec.uncoded.label'),
        description: this.translation.translate('codec.uncoded.description')
      },
      {
        value: 'hamming74',
        label: this.translation.translate('codec.hamming74.label'),
        description: this.translation.translate('codec.hamming74.description')
      },
      {
        value: 'extended-hamming84',
        label: this.translation.translate('codec.extendedHamming84.label'),
        description: this.translation.translate('codec.extendedHamming84.description')
      },
      {
        value: 'bch',
        label: this.translation.translate('codec.bch.label'),
        description: this.translation.translate('codec.bch.description')
      }
    ];
  }

  protected get selectedCodecDescription(): string {
    return this.codecOptions.find(option => option.value === this.codec)?.description ?? '';
  }

  protected toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
  }

  protected async loadImage(file: File): Promise<void> {
    this.uploadError.set('');
    this.simulationMessage.set('');
    if (!file.type.startsWith('image/')) {
      this.uploadError.set(this.translation.translate('image.invalidType'));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.uploadError.set(this.translation.translate('image.tooLarge'));
      return;
    }
    if (this.previewUrl()) URL.revokeObjectURL(this.previewUrl()!);
    this.selectedFile.set(file);
    this.previewUrl.set(null);
    this.isUploading.set(true);
    try {
      const grayscale = await this.imageService.uploadAndGetGrayscale(file);
      this.previewUrl.set(grayscale.url);
      this.imageDimensions.set(this.translation.translate('image.dimensions', {
        width: grayscale.width,
        height: grayscale.height
      }));
    } catch {
      this.selectedFile.set(null);
      this.uploadError.set(this.translation.translate('image.uploadFailed'));
    } finally {
      this.isUploading.set(false);
    }
  }

  protected clearImage(): void {
    if (this.previewUrl()) URL.revokeObjectURL(this.previewUrl()!);
    this.selectedFile.set(null);
    this.previewUrl.set(null);
    this.isUploading.set(false);
    this.imageDimensions.set('');
    this.simulationMessage.set('');
  }

  protected startSimulation(): void {
    this.simulationMessage.set('');
    this.simulationPhase.set('processing');
    if (this.simulationTimer) clearTimeout(this.simulationTimer);
    this.simulationTimer = setTimeout(() => {
      this.simulationPhase.set('results');
      this.simulationTimer = null;
    }, 1200);
  }

  protected resetSimulation(): void {
    this.simulationPhase.set(null);
  }

  public ngOnDestroy(): void {
    if (this.simulationTimer) clearTimeout(this.simulationTimer);
    if (this.previewUrl()) URL.revokeObjectURL(this.previewUrl()!);
  }
}
