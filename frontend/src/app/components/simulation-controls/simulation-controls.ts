import { Component, inject, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideArrowRight, LucideSlidersHorizontal } from '@lucide/angular';
import { TranslationService } from '../../services/translation-service/translation.service';

export interface CodecOption {
  value: string;
  label: string;
  description: string;
}

@Component({
  imports: [FormsModule, LucideArrowRight, LucideSlidersHorizontal],
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

  protected selectCodec(value: string): void {
    this.codec.set(value);
  }

  protected selectNoiseModel(value: string): void {
    this.noiseModel.set(value);
  }

  protected codecLabel(): string {
    return this.codecOptions().find(option => option.value === this.codec())?.label ?? '';
  }

  protected noiseModelLabel(): string {
    const key = this.noiseModel() === 'burst' ? 'simulation.burst' : 'simulation.independent';
    return this.translation.translate(key);
  }

  protected closeOtherMenu(openedMenu: HTMLDetailsElement, otherMenu: HTMLDetailsElement): void {
    if (openedMenu.open) otherMenu.open = false;
  }
}
