import { Injectable, inject, signal } from '@angular/core';
import { TranslocoService, getBrowserLang } from '@jsverse/transloco';
import { DOCUMENT } from '@angular/common';

export const SUPPORTED_LOCALES = ['en', 'es'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: 'English',
  es: 'Espanol',
};

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private transloco = inject(TranslocoService);
  private doc = inject(DOCUMENT);

  readonly currentLocale = signal<SupportedLocale>('en');

  setLocale(lang: string) {
    const locale = this.resolveLocale(lang);
    this.currentLocale.set(locale);
    this.transloco.setActiveLang(locale);
    this.doc.documentElement.lang = locale;
    localStorage.setItem('preferred-lang', locale);
  }

  detectLocale(): SupportedLocale {
    const stored = localStorage.getItem('preferred-lang');
    if (stored && this.isSupported(stored)) return stored as SupportedLocale;
    const browser = getBrowserLang() ?? 'en';
    return this.resolveLocale(browser);
  }

  isSupported(lang: string): boolean {
    return SUPPORTED_LOCALES.includes(lang as SupportedLocale);
  }

  localizeRoute(path: string): string {
    const locale = this.currentLocale();
    if (locale === 'en') return path;
    return `/${locale}${path}`;
  }

  private resolveLocale(lang: string): SupportedLocale {
    const short = lang.split('-')[0].toLowerCase();
    return SUPPORTED_LOCALES.includes(short as SupportedLocale)
      ? (short as SupportedLocale)
      : 'en';
  }
}
