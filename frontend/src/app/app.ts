import { Component, OnDestroy, inject } from '@angular/core';
import { AppHeader } from './components/app-header/app-header';
import { ImageUpload } from './components/image-upload/image-upload';
import {
  CodecOption,
  SimulationControls
} from './components/simulation-controls/simulation-controls';
import { TranslationService } from './services/translation-service/translation.service';

@Component({
  imports: [AppHeader, ImageUpload, SimulationControls],
  selector: 'app-root',
  templateUrl: './app.html',
  host: {
    '[class.dark-theme]': 'isDarkMode'
  }
})
export class App implements OnDestroy {
  private readonly translation = inject(TranslationService);

  isDarkMode = false;

  protected selectedFile: File | null = null;

  protected previewUrl: string | null = null;

  protected imageDimensions = '';

  protected uploadError = '';

  protected simulationMessage = '';

  protected codec = 'hamming74';

  protected noiseModel = 'independent';

  protected errorProbability = 0.01;

  protected burstLength = 8;

  protected burstCount = 1;

  protected randomSeed: number | null = null;

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
    this.uploadError = '';
    this.simulationMessage = '';
    if (!file.type.startsWith('image/')) {
      this.uploadError = this.translation.translate('image.invalidType');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.uploadError = this.translation.translate('image.tooLarge');
      return;
    }
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.selectedFile = file;
    this.previewUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      this.imageDimensions = this.translation.translate('image.dimensions', {
        width: image.naturalWidth,
        height: image.naturalHeight
      });
    };
    image.src = this.previewUrl;
  }

  protected clearImage(): void {
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.selectedFile = null;
    this.previewUrl = null;
    this.imageDimensions = '';
    this.simulationMessage = '';
  }

  protected startSimulation(): void {
    this.simulationMessage = this.translation.translate('simulation.saved');
  }

  public ngOnDestroy(): void {
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
  }
}
