import { Service, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { WebApiService } from '../web-api/web-api.service';

export type TranslationKey = string;
export type Locale = 'en' | 'pl';

@Service()
export class TranslationService {
  private readonly api = inject(WebApiService);

  private readonly locale = signal<Locale>(this.detectLocale());

  private readonly translations = signal<Record<string, string>>({});

  public async initialize(): Promise<void> {
    await this.loadLocale(this.locale());
  }

  public translate(key: TranslationKey, values: Record<string, string | number> = {}): string {
    let text = this.translations()[key] ?? key;
    for (const [name, value] of Object.entries(values)) {
      text = text.replaceAll(`{{${name}}}`, String(value));
    }
    return text;
  }

  public get currentLocale(): Locale {
    return this.locale();
  }

  public toggleLocale(): void {
    const nextLocale: Locale = this.locale() === 'en' ? 'pl' : 'en';
    void this.loadLocale(nextLocale);
  }

  private async loadLocale(locale: Locale): Promise<void> {
    const translations = await firstValueFrom(this.api.getTranslations(locale));
    this.translations.set(translations);
    this.locale.set(locale);
  }

  private detectLocale(): Locale {
    return typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('pl')
      ? 'pl'
      : 'en';
  }
}
