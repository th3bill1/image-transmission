import { Component, inject, input, output } from '@angular/core';
import { LucideLanguages, LucideMoon, LucideSun } from '@lucide/angular';
import { TranslationService } from '../../services/translation-service/translation.service';

@Component({
  imports: [LucideLanguages, LucideMoon, LucideSun],
  selector: 'app-header',
  templateUrl: './app-header.html'
})
export class AppHeader {
  protected readonly translation = inject(TranslationService);

  readonly isDarkMode = input(false);

  readonly currentStep = input(1);

  protected readonly toggleTheme = output<void>();

  protected toggleLanguage(): void {
    this.translation.toggleLocale();
  }
}
