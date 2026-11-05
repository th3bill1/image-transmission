import { Component, inject, input, output } from '@angular/core';
import { TranslationService } from '../../services/translation-service/translation.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.html'
})
export class AppHeader {
  protected readonly translation = inject(TranslationService);

  readonly isDarkMode = input(false);

  protected readonly toggleTheme = output<void>();

  protected toggleLanguage(): void {
    this.translation.toggleLocale();
  }
}
