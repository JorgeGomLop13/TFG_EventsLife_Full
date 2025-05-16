/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '@app/core/locale/locale.service';
import { AuthService } from '@app/services/auth.service';
import { CartService } from '@app/services/cart.service';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  public token: string | null = localStorage.getItem('token');
  public userName: string | null = '';
  public userRole: string | null = '';
  public userBooksInCart: [] = [];

  public currentLang: string = '';

  @Input() booksList = [];

  constructor(private authService: AuthService, private localeService: LocaleService, private cartService: CartService) {}

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang');
    this.currentLang = savedLang ? savedLang : 'es';

    if (this.token) {
      this.userRole = this.authService.getRole();
      this.userName = this.authService.getUserName();
      this.userRole = localStorage.getItem('role');
      this.cartService
        .getCartBooksByIds()
        .pipe(take(1))
        .subscribe((res: any) => {
          //Para que al actualizar la pantalla se mantenga el número de libros del carrito
          this.booksList = res.books;
        });
    }
  }

  switchLang(event: any) {
    const lang = (event.target as HTMLSelectElement).value;

    if (!lang || lang === this.currentLang) {
      return;
    }

    this.currentLang = lang;
    this.localeService.changeLang(lang);
  }
}
