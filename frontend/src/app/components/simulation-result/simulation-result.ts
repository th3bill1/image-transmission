import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { LucideArrowRight, LucideCheck, LucideShieldCheck, LucideSparkles } from '@lucide/angular';
import { TranslationService } from '../../services/translation-service/translation.service';
import { SimulationResult as ApiSimulationResult } from '../../services/web-api/web-api.models';

export type SimulationPhase = 'processing' | 'results' | 'summary';

export interface SimulationParameters {
  codec: string;
  noiseModel: string;
  errorProbability: number;
  burstLength: number;
  burstCount: number;
  randomSeed: number | null;
}

@Component({
  imports: [CommonModule, LucideArrowRight, LucideCheck, LucideShieldCheck, LucideSparkles],
  selector: 'app-simulation-result',
  templateUrl: './simulation-result.html'
})
export class SimulationResult {
  protected readonly translation = inject(TranslationService);

  readonly phase = input<SimulationPhase>('processing');

  readonly previewUrl = input<string | null>(null);

  readonly originalPreviewUrl = input<string | null>(null);

  readonly parameters = input<SimulationParameters | null>(null);

  readonly result = input<ApiSimulationResult | null>(null);

  readonly restart = output<void>();

  readonly summary = output<void>();
}
