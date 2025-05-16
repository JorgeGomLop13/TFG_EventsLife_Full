/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LocationService } from '@app/services/location.service';
import { UseBackService } from '@app/services/use-back.service';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterLink, TranslateModule],
  providers: [LocationService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  public role_selected: string = 'reader';
  public name: string = '';
  public email: string = '';
  public password: string = '';
  public confirmation_password: string = '';
  public terms_conditions: boolean = false;

  public countries: any[] = [];
  public comunities: any[] = [];
  public provinces: any[] = [];

  public select_country: string = '';
  public select_comunity: string = '';
  public select_province: string = '';

  public errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private getData: UseBackService,
    private location: LocationService
  ) {
    //Si el usuario ya tiene un token, lo eliminamos para que se registre de nuevo si es que pone la ruta de register
    this.deleteLocalStorage();

    this.location
      .getCountries()
      .pipe(take(1))
      .subscribe((res: any) => {
        this.countries = res;
      });
    this.location
      .getCommunities()
      .pipe(take(1))
      .subscribe((res: any) => {
        this.comunities = res;
      });
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
      const user = {
        name: this.name,
        email: this.email,
        password: this.password,
        role: this.role_selected,
        isoCode: this.select_country,
        communityId: this.select_comunity,
        provinceId: this.select_province,
        id: ''
      };

      this.authService
        .register(user)
        .pipe(take(1))
        .subscribe({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          next: (res: any) => {
            console.log('Usuario registrado:', res);
            localStorage.setItem('token', res.token);
            localStorage.setItem('userId', res.user.id);
            localStorage.setItem('userName', res.user.name);
            localStorage.setItem('role', res.user.role);
            localStorage.setItem('userEmail', res.user.email);
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

  resetCommunitiesProvinces(Event: Event) {
    const country = (Event.target as HTMLSelectElement).value;
    if (country != 'ES') {
      this.select_comunity = '';
      this.select_province = '';
    }
  }

  setProvince(Event: Event) {
    const provinceId = (Event.target as HTMLSelectElement).value;
    this.location
      .getProvinces(provinceId)
      .pipe(take(1))
      .subscribe((res: any) => {
        this.provinces = res;
      });
  }

  deleteLocalStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('role');
    localStorage.removeItem('userEmail');
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
