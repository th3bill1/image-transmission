import { Component, inject, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation-service/translation.service';

export interface CodecOption {
  value: string;
  label: string;
  description: string;
}

@Component({
  imports: [FormsModule],
  selector: 'app-simulation-controls',
  templateUrl: './simulation-controls.html'
})
export class SimulationControls {
  protected readonly translation = inject(TranslationService);

  readonly previewUrl = input<string | null>(null);

  readonly codec = model('');

  readonly codecOptions = input<readonly CodecOption[]>([]);

  readonly selectedCodecDescription = input('');

  readonly noiseModel = model('');

  readonly errorProbability = model(0);

  readonly burstLength = model(0);

  readonly burstCount = model(0);

  readonly randomSeed = model<number | null>(null);

  readonly simulationMessage = input('');

  readonly simulationStarted = output<void>();
}
