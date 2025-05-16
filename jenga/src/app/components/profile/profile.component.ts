/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { CartService } from '@app/services/cart.service';
import { StripeService } from '@app/services/stripe.service';
import { UseBackService } from '@app/services/use-back.service';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-profile',
  imports: [HeaderComponent, CommonModule, RouterLink, TranslateModule],
  providers: [StripeService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  public userId: string | null = localStorage.getItem('userId');
  public userName: string | null = localStorage.getItem('userName');
  public userEmail: string | null = localStorage.getItem('userEmail');
  public userRole: string | null = localStorage.getItem('role');
  public userHistory: number[] = [];

  public userBooks: any[] = [];

  public booksInCart: any[] = [];
  public booksInHistory: any[] = [];

  constructor(
    private useData: UseBackService,
    private auth: AuthService,
    private stripe: StripeService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    if (this.userRole === 'writer') {
      this.useData
        .getBookById(this.userId!)
        .pipe(take(1))
        .subscribe((res: any) => {
          this.userBooks = res;
          console.log(res);
        });
    }
    if (this.userId && this.userRole === 'reader') {
      this.useData
        .getUserById(this.userId)
        .pipe(take(1))
        .subscribe((res: any) => {
          this.userHistory = res.history;
          console.log(this.userHistory);
          this.cartService
            .getHistoryBooksByIds()
            .pipe(take(1))
            .subscribe((res: any) => {
              this.booksInHistory = res.books;
            });
        });
    }
  }

  deleteBook(id: string) {
    this.useData
      .deleteBook(id)
      .pipe(take(1))
      .subscribe(() => {});
    this.userBooks = this.userBooks.filter((book) => book.id !== id);
  }

  createStripeAccount() {
    this.stripe.createStripeAccount().subscribe((res: any) => {
      window.location.href = res.url;
    });
  }

  logout() {
    this.auth.logout();
  }
}
