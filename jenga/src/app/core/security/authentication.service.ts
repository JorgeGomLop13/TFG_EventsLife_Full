import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { ENV } from '@core/constants/global.constants';
import { Env } from '@core/types/env';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements OnDestroy {
  public readonly LOGIN_PATH = '/api/users/login';
  public readonly REFRESH_TOKEN_PATH = '/api/users/refreshToken';

  // private tokenTimeout: NodeJS.Timer | undefined = undefined;

  constructor(@Inject(ENV) private env: Env, private http: HttpClient) {}

  ngOnDestroy(): void {
    this.logout();
  }

  public getToken(): string {
    //TODO: implement getToken
    return '';
  }

  // public signIn(credentials: {
  //   userName: string;
  //   password: string;
  // }): Observable<LoginDTO> {
  //   return this.http
  //     .post<LoginDTO>(`${this.env.apiBaseUrl}${this.LOGIN_PATH}`, credentials)
  //     .pipe(catchError((error) => throwError(error as ServiceError)));
  // }

  /**
   * Log the current user out by removing credentials and log out from the system
   */
  logout(): void {}
}
