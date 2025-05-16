import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard (class-based)', () => {
  let guard: authGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [authGuard, { provide: AuthService, useValue: authServiceSpy }, { provide: Router, useValue: routerSpy }]
    });

    guard = TestBed.inject(authGuard);
  });

  it('should allow access if authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);

    const result = guard.canActivate();

    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and redirect if not authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false);

    const result = guard.canActivate();

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
