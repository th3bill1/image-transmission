declare module 'i18n' {
  export interface I18nOptions {
    defaultLocale?: string;
    locales?: string[];
    staticCatalog?: Record<string, Record<string, string>>;
    updateFiles?: boolean;
  }

  export class I18n {
    public constructor(options?: I18nOptions);
    public __(phrase: string): string;
  }
}
