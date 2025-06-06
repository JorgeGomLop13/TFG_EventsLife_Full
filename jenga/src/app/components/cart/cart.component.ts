/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { CartService } from '@app/services/cart.service';
import { StripeService } from '@app/services/stripe.service';
import { UseBackService } from '@app/services/use-back.service';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-cart',
  imports: [HeaderComponent, CommonModule, TranslateModule, FooterComponent],
  providers: [StripeService],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  public eventsInCart: any[] = [];
  eventsList: [] = [];
  public userName: string | null = '';
  public userRole: string | null = '';
  public userId: number = 0;

  constructor(
    private useData: UseBackService,
    private stripe: StripeService,
    private cartService: CartService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth
      .getUser()
      .pipe(take(1))
      .subscribe((res: any) => {
        this.userName = res.name;
        this.userRole = res.role;
        this.userId = res.id;
        this.cartService
          .getCartEventsByIds(this.userId)
          .pipe(take(1))
          .subscribe((res: any) => {
            this.eventsInCart = res.events;
            console.log(this.eventsInCart);
          });
      });
  }
  deleteEventShoping(id: number) {
    this.cartService
      .deleteEventFromCart(this.userId, id)
      .pipe(take(1))
      .subscribe((res: any) => {
        console.log(res);
        this.eventsList = res.cart;
      });

    this.eventsInCart = this.eventsInCart.filter((event) => event.id !== id);
  }

  payForProduct(eventId: number, eventPrice: number, eventTitle: string, authorId: number, maxPeople: number, actualPeople: []) {
    if (this.userId) {
      if (actualPeople.length < maxPeople) {
        this.useData
          .getUserById(authorId)
          .pipe(take(1))
          .subscribe((res: any) => {
            const authorStripeId = res.stripeAccountId;
            this.stripe.payProduct(eventTitle, eventPrice, authorStripeId, eventId).subscribe((res: any) => {
              window.location.href = res.url;
            });
          });
      } else {
        console.log(actualPeople.length);
        console.log(maxPeople);
        alert();
      }
    }
  }
  /*
  decreaseQuantity(event: any) {}
  increaseQuantity(event: any) {}*/
}
