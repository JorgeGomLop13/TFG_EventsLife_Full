import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withHashLocation, withViewTransitions } from '@angular/router';

import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DEFAULT_I18N_LANG, ENV } from '@core/constants/global.constants';
import { environment } from '@env';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { apiInterceptor } from './core/interceptors/api.interceptor';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation(), withViewTransitions()),
    provideHttpClient(withInterceptors([apiInterceptor])),
    importProvidersFrom([
      TranslateModule.forRoot({
        defaultLanguage: DEFAULT_I18N_LANG,
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ]),
    // * IMPORTANT: When you need to use environment variables,
    // * provide them like this! And use them with `@Inject(ENV)`.
    // * See `app.component.ts` for an example.
    { provide: ENV, useValue: environment },
    provideAnimationsAsync()
  ]
};
