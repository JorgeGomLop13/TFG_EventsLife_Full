import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_I18N_LANG, SUPPORTED_LANGS } from '../constants/global.constants';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  private translate: TranslateService = inject(TranslateService);

  setupAppLanguage(lang?: string): void {
    const storedLang = localStorage.getItem('lang');

    if (lang && this.isAvailabeLanguage(lang)) {
      this.translate.use(lang);
      localStorage.setItem('lang', lang);
    } else if (storedLang && this.isAvailabeLanguage(storedLang)) {
      this.translate.use(storedLang);
    } else if (this.isAvailabeLanguage(this.getNavigatorLanguageCode())) {
      const navLang = this.getNavigatorLanguageCode();
      this.translate.use(navLang);
      localStorage.setItem('lang', navLang);
    } else {
      this.translate.use(DEFAULT_I18N_LANG);
      localStorage.setItem('lang', DEFAULT_I18N_LANG);
    }
  }

  changeLang(lang: string): void {
    if (this.isAvailabeLanguage(lang)) {
      this.translate.use(lang);
      localStorage.setItem('lang', lang);
    }
  }

  private getNavigatorLanguageCode(): string {
    const lastLanguageSubstringIndex = 2;
    return navigator?.language?.substring(0, lastLanguageSubstringIndex);
  }

  private isAvailabeLanguage(lang: string): boolean {
    return SUPPORTED_LANGS.includes(lang);
  }
}
