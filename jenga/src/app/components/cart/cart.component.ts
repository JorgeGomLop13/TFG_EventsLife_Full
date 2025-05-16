/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CartService } from '@app/services/cart.service';
import { StripeService } from '@app/services/stripe.service';
import { UseBackService } from '@app/services/use-back.service';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-cart',
  imports: [HeaderComponent, CommonModule, TranslateModule],
  providers: [StripeService],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  public booksInCart: any[] = [];
  booksList: [] = [];

  constructor(private useData: UseBackService, private stripe: StripeService, private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService
      .getCartBooksByIds()
      .pipe(take(1))
      .subscribe((res: any) => {
        this.booksInCart = res.books;
        console.log(this.booksInCart);
      });
  }
  deleteBookShoping(id: string) {
    this.cartService
      .deleteBookFromCart(id)
      .pipe(take(1))
      .subscribe((res: any) => {
        console.log(res);
        this.booksList = res.books;
      });

    this.booksInCart = this.booksInCart.filter((book) => book.id !== id);
  }
  payForProduct(bookId: string, bookPrice: number, bookTitle: string, authorId: string) {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.useData
        .getUserById(authorId)
        .pipe(take(1))
        .subscribe((res: any) => {
          const authorStripeId = res.stripeAccountId;
          this.stripe.payProduct(bookTitle, bookPrice, authorStripeId, bookId, userId).subscribe((res: any) => {
            window.location.href = res.url;
          });
        });
    }
  }
  decreaseQuantity(book: any) {}
  increaseQuantity(book: any) {}
}
