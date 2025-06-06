import {
  HttpErrorResponse,
  HttpHandler,
  HttpHeaderResponse,
  HttpInterceptor,
  HttpProgressEvent,
  HttpRequest,
  HttpResponse,
  HttpSentEvent,
  HttpUserEvent
} from '@angular/common/http';
import { Inject, Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { ServiceError } from '../types/error';
import { RouteConstants } from '../constants/route.constants';
import { Env } from '../types/env';
import { ENV } from '../constants/global.constants';
import { Router } from '@angular/router';
import { GlobalMessageService } from '@app/common/global-message/global-message.service';
import { TranslateService } from '@ngx-translate/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

type ObservableResponse = Observable<
  HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<unknown> | HttpUserEvent<unknown>
>;

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private static readonly AUTHORIZATION = 'Authorization';
  private static readonly CACHE = 'Cache-Control';
  private static readonly OFFSET = 'Offset';

  private readonly BYPASS_URLS: string[] = ['/assets/', 'accounts.logout'];

  private readonly router: Router = inject(Router);
  // private readonly dialog: MatDialog = inject(MatDialog);
  private readonly globalMessage: GlobalMessageService = inject(GlobalMessageService);
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly authenticationService: AuthenticationService = inject(AuthenticationService);

  constructor(@Inject(ENV) private env: Env) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): ObservableResponse {
    if (this.bypassInterceptor(req)) {
      return next.handle(req);
    }

    const access_token = this.authenticationService.getToken();

    if (access_token) {
      return next
        .handle(this.addTokenHeaders(req, access_token))
        .pipe(catchError((error): ObservableResponse => this.handleError(error)));
    } else {
      return next.handle(req).pipe(catchError((error): ObservableResponse => this.handleError(error)));
    }
  }

  private addTokenHeaders(req: HttpRequest<unknown>, access_token: string): HttpRequest<unknown> {
    return req.clone({
      setHeaders: {
        [TokenInterceptor.AUTHORIZATION]: `Bearer ${access_token}`,
        [TokenInterceptor.CACHE]: 'no-cache'
        // [TokenInterceptor.OFFSET]: new Date().getTimezoneOffset().toString()
      }
    });
  }

  private bypassInterceptor(req: HttpRequest<unknown>): boolean {
    return this.BYPASS_URLS.some((url) => req.url.includes(url));
  }

  private logout(error: ServiceError): ObservableResponse {
    this.authenticationService.logout();
    this.router.navigate([RouteConstants.LOGIN]);
    return throwError(() => error);
  }

  private handleError(error: HttpErrorResponse | unknown): ObservableResponse {
    if (!(error instanceof HttpErrorResponse)) {
      return throwError(() => error);
    }

    switch (error.status) {
      case 401:
        // this.dialog.closeAll();
        return this.logout(error.error);
      case 403:
        // this.dialog.closeAll();
        return this.handle403Error(error.error);
      default:
        return throwError(() => error);
    }
  }

  private handle403Error(error: ServiceError): ObservableResponse {
    this.router.navigate([RouteConstants.MAIN]);
    this.globalMessage.showError({
      message: this.translateService.instant(marker('common.accessDenied')),
      actionText: this.translateService.instant(marker('common.close'))
    });
    return throwError(() => error);
  }
}
