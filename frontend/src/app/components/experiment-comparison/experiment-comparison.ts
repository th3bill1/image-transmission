import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucidePlay, LucideX } from '@lucide/angular';
import { TranslationService } from '../../services/translation-service/translation.service';
import {
  CodecDescriptor,
  ExperimentRequest,
  ExperimentResult,
  NoiseModelDescriptor
} from '../../services/web-api/web-api.models';

@Component({
  imports: [CommonModule, FormsModule, LucidePlay, LucideX],
  selector: 'app-experiment-comparison',
  templateUrl: './experiment-comparison.html'
})
export class ExperimentComparison {
  protected readonly translation = inject(TranslationService);

  readonly codecs = input<readonly CodecDescriptor[]>([]);

  readonly noiseModels = input<readonly NoiseModelDescriptor[]>([]);

  readonly result = input<ExperimentResult | null>(null);

  readonly busy = input(false);

  readonly fileName = input('');

  readonly imageId = input<string | null>(null);

  readonly closed = output<void>();

  readonly run = output<ExperimentRequest>();

  protected selectedCodecs: string[] = [];

  protected selectedNoiseModels: string[] = [];

  protected errorProbabilities = '0,0.01,0.05,0.1';

  protected randomSeeds = '17,42';

  protected burstLength = 8;

  protected burstCount = 1;

  protected readonly chartMetrics = [
    { key: 'incorrectPixelPercentage' as const, label: 'experiment.pixelError' },
    { key: 'meanAbsoluteBrightnessError' as const, label: 'experiment.brightnessError' }
  ];

  protected toggle(values: string[], value: string): void {
    const index = values.indexOf(value);
    if (index >= 0) values.splice(index, 1);
    else values.push(value);
  }

  protected isSelected(values: string[], value: string): boolean {
    return values.includes(value);
  }

  protected submit(): void {
    this.run.emit({
      fileName: this.fileName(),
      codecs: [...this.selectedCodecs],
      noiseModels: [...this.selectedNoiseModels],
      errorProbabilities: this.parseNumbers(this.errorProbabilities),
      randomSeeds: this.parseNumbers(this.randomSeeds).map(Math.trunc),
      burstLength: this.burstLength,
      burstCount: this.burstCount,
      imageId: this.imageId()
    });
  }

  protected maxMetric(metric: 'incorrectPixelPercentage' | 'meanAbsoluteBrightnessError'): number {
    return Math.max(...(this.result()?.rows ?? []).map(row => row.metrics[metric]), 1);
  }

  protected barWidth(value: number, metric: 'incorrectPixelPercentage' | 'meanAbsoluteBrightnessError'): string {
    return `${Math.max(3, (value / this.maxMetric(metric)) * 100)}%`;
  }

  protected metricValue(
    row: ExperimentResult['rows'][number],
    metric: 'incorrectPixelPercentage' | 'meanAbsoluteBrightnessError'
  ): number {
    return row.metrics[metric];
  }

  private parseNumbers(value: string): number[] {
    return value
      .split(',')
      .map(item => Number(item.trim()))
      .filter(Number.isFinite);
  }
}
