import { Service, signal } from '@angular/core';
import type { I18n } from 'i18n';
import { translations } from '../../translations';

type TranslationKey = keyof (typeof translations)['en'];
type Locale = keyof typeof translations;

@Service()
export class TranslationService {
  private readonly locale = signal<Locale>(this.detectLocale());

  private readonly i18n: Pick<I18n, '__'> = {
    __: key => {
      const localeTranslation = translations[this.locale()][key as TranslationKey];
      return localeTranslation ?? translations.en[key as TranslationKey] ?? key;
    }
  };

  public translate(key: TranslationKey, values: Record<string, string | number> = {}): string {
    let text = this.i18n.__(key);
    for (const [name, value] of Object.entries(values)) {
      text = text.replaceAll(`{{${name}}}`, String(value));
    }
    return text;
  }

  public get currentLocale(): Locale {
    return this.locale();
  }

  public toggleLocale(): void {
    this.locale.update(locale => (locale === 'en' ? 'pl' : 'en'));
  }

  private detectLocale(): Locale {
    if (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('pl')) {
      return 'pl';
    }

    return 'en';
  }
}
