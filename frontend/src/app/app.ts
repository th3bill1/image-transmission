import { Component, OnDestroy, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
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
import { SimulationService } from './services/simulation-service/simulation.service';
import { SimulationResult as ApiSimulationResult } from './services/web-api/web-api.models';

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

  private readonly simulationService = inject(SimulationService);

  isDarkMode = true;

  protected readonly selectedFile = signal<File | null>(null);

  protected readonly previewUrl = signal<string | null>(null);

  protected readonly originalPreviewUrl = signal<string | null>(null);

  protected readonly isUploading = signal(false);

  protected readonly imageDimensions = signal('');

  protected readonly uploadError = signal('');

  protected readonly simulationMessage = signal('');

  protected readonly simulationResult = signal<ApiSimulationResult | null>(null);

  protected codec = 'hamming74';

  protected noiseModel = 'independent';

  protected errorProbability = 0.01;

  protected burstLength = 8;

  protected burstCount = 1;

  protected randomSeed: number | null = null;

  protected readonly simulationPhase = signal<SimulationPhase | null>(null);

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
    this.simulationResult.set(null);
    this.simulationPhase.set(null);
    if (!file.type.startsWith('image/')) {
      this.uploadError.set(this.translation.translate('image.invalidType'));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.uploadError.set(this.translation.translate('image.tooLarge'));
      return;
    }
    if (this.previewUrl()) URL.revokeObjectURL(this.previewUrl()!);
    if (this.originalPreviewUrl()) URL.revokeObjectURL(this.originalPreviewUrl()!);
    this.selectedFile.set(file);
    this.originalPreviewUrl.set(URL.createObjectURL(file));
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
    if (this.originalPreviewUrl()) URL.revokeObjectURL(this.originalPreviewUrl()!);
    this.selectedFile.set(null);
    this.originalPreviewUrl.set(null);
    this.previewUrl.set(null);
    this.isUploading.set(false);
    this.imageDimensions.set('');
    this.simulationMessage.set('');
  }

  protected async startSimulation(): Promise<void> {
    this.simulationMessage.set('');
    const validationError = this.validateSimulation();
    if (validationError) {
      this.simulationMessage.set(validationError);
      return;
    }

    this.simulationPhase.set('processing');
    const startedAt = Date.now();
    try {
      const simulation$ = this.simulationService.run(this.selectedFile()!, {
        codec: this.codec,
        noiseModel: this.noiseModel,
        errorProbability: this.errorProbability,
        burstLength: this.burstLength,
        burstCount: this.burstCount,
        randomSeed: this.randomSeed
      });
      const result = await firstValueFrom(simulation$);
      await this.waitForMinimumProcessingTime(startedAt);
      this.simulationResult.set(result);
      this.simulationPhase.set('results');
    } catch {
      await this.waitForMinimumProcessingTime(startedAt);
      this.simulationPhase.set(null);
      this.simulationMessage.set(this.translation.translate('simulation.failed'));
    }
  }

  protected showSummary(): void {
    this.simulationPhase.set('summary');
  }

  protected resetSimulation(): void {
    this.simulationPhase.set(null);
    this.simulationResult.set(null);
    this.simulationMessage.set('');
  }

  public ngOnDestroy(): void {
    if (this.previewUrl()) URL.revokeObjectURL(this.previewUrl()!);
    if (this.originalPreviewUrl()) URL.revokeObjectURL(this.originalPreviewUrl()!);
  }

  private validateSimulation(): string | null {
    if (!this.selectedFile()) return this.translation.translate('simulation.uploadRequired');
    if (!Number.isFinite(this.errorProbability) || this.errorProbability < 0 || this.errorProbability > 1) {
      return this.translation.translate('simulation.invalidProbability');
    }
    if (this.noiseModel === 'burst' && this.burstLength < 1) {
      return this.translation.translate('simulation.invalidBurstLength');
    }
    if (this.noiseModel === 'burst' && this.burstCount < 1) {
      return this.translation.translate('simulation.invalidBurstCount');
    }
    if (this.randomSeed !== null && !Number.isInteger(this.randomSeed)) {
      return this.translation.translate('simulation.invalidSeed');
    }
    return null;
  }

  private async waitForMinimumProcessingTime(startedAt: number): Promise<void> {
    const remaining = 1000 - (Date.now() - startedAt);
    if (remaining > 0) {
      await new Promise<void>(resolve => setTimeout(resolve, remaining));
    }
  }
}
