/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UseBackService } from '@app/services/use-back.service';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterLink, TranslateModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  public role_selected: string = 'standart';
  public name: string = '';
  public email: string = '';
  public password: string = '';
  public confirmation_password: string = '';
  public phone: string = '';
  public address: string = '';
  public terms_conditions: boolean = false;

  public errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private getData: UseBackService) {
    //Si el usuario ya tiene un token, lo eliminamos para que se registre de nuevo si es que pone la ruta de register
    this.deleteLocalStorage();
  }

  register() {
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
    if (!emailValido) {
      this.errorMessage = 'Introduce un correo válido.';
      this.email = '';
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
      return;
    }
    if (this.password !== this.confirmation_password) {
      this.errorMessage = 'PASSWORD';
      this.password = '';
      this.confirmation_password = '';
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
      return;
    } else {
      const formData = new FormData();

      formData.append('name', this.name);
      formData.append('email', this.email);
      formData.append('password', this.password);
      formData.append('role', this.role_selected);
      formData.append('phone', this.phone);
      formData.append('address', this.address);

      this.authService
        .register(formData)
        .pipe(take(1))
        .subscribe({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          next: (res: any) => {
            console.log('Usuario registrado:', res);
            localStorage.setItem('token', res.token);
            this.router.navigate(['/home']);
          },
          error: (error) => {
            console.error('Error al registrar:', error);
            this.errorMessage = error?.error?.errorCode;
            setTimeout(() => {
              this.errorMessage = '';
            }, 5000);
          },
          complete: () => {
            console.log('Petición completada.');
          }
        });
    }
  }

  changeRoleSelected(role: string) {
    this.role_selected = role;
  }
  getRoleSelected() {
    return this.role_selected;
  }

  deleteLocalStorage() {
    localStorage.removeItem('token');
  }
  goHome() {
    this.router.navigate(['/home']).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  toLogin() {
    this.router.navigate(['/login']).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
