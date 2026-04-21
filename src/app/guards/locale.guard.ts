import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { LocaleService } from '../services/locale.service';

export const localeGuard: CanActivateFn = (route) => {
  const lang = route.data['lang'] as string | undefined;
  if (lang) {
    inject(LocaleService).setLocale(lang);
  }
  return true;
};
