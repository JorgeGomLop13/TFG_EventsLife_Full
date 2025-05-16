import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, CommonModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public email: string = '';
  public password: string = '';

  public errorMessage = '';
  public showErrorMessage = true;

  constructor(private authService: AuthService, private router: Router) {
    //Si el usuario ya tiene un token, se elimina para que inicie sesión de nuevo si es que pone la ruta de login
    this.deleteLocalStorage();
  }

  login() {
    this.authService
      .login(this.email, this.password)
      .pipe(take(1))
      .subscribe({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: (res: any) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('userId', res.user.id);
          localStorage.setItem('userName', res.user.name);
          localStorage.setItem('role', res.user.role);
          localStorage.setItem('userEmail', res.user.email);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Error al iniciar sesión:', error);
          if (error.status === 400 && error.error.message === 'Invalid credentials') {
            this.errorMessage = error?.error?.errorCode;
          } else {
            this.errorMessage = 'DEFAULT';
          }

          this.password = '';
          //A los 5 segundos se borra el mensaje
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        },
        complete: () => {
          console.log('Login completado');
        }
      });
  }

  deleteLocalStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('role');
    localStorage.removeItem('userEmail');
  }
}
