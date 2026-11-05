import { Component, inject, input, output } from '@angular/core';
import { TranslationService } from '../../services/translation-service/translation.service';

export type SimulationPhase = 'processing' | 'results';

@Component({
  selector: 'app-simulation-result',
  templateUrl: './simulation-result.html'
})
export class SimulationResult {
  protected readonly translation = inject(TranslationService);

  readonly phase = input<SimulationPhase>('processing');

  readonly previewUrl = input<string | null>(null);

  readonly restart = output<void>();
}
