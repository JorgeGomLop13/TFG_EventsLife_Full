import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  private router: Router = inject(Router);
  canActivate(): boolean {
    return true;
  }
}
