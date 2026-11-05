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

  isDarkMode = false;

  protected readonly selectedFile = signal<File | null>(null);

  protected readonly previewUrl = signal<string | null>(null);

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

  protected loadImage(file: File): void {
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
    this.previewUrl.set(URL.createObjectURL(file));
    const image = new Image();
    image.onload = () => {
      this.imageDimensions.set(this.translation.translate('image.dimensions', {
        width: image.naturalWidth,
        height: image.naturalHeight
      }));
    };
    image.src = this.previewUrl()!;
  }

  protected clearImage(): void {
    if (this.previewUrl()) URL.revokeObjectURL(this.previewUrl()!);
    this.selectedFile.set(null);
    this.previewUrl.set(null);
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
