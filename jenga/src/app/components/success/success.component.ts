import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '@app/services/cart.service';
import { StripeService } from '@app/services/stripe.service';
import { UseBackService } from '@app/services/use-back.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';

@Component({
  selector: 'app-success',
  imports: [RouterLink, TranslateModule],
  providers: [StripeService],
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss'
})
export class SuccessComponent implements OnInit {
  public textShow1: string = '';
  public textShow2: string = '';
  public textShow3: string = '';

  constructor(
    private route: ActivatedRoute,
    private useBack: UseBackService,
    private stripe: StripeService,
    private cartService: CartService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('productId');
    const stripeId = this.route.snapshot.paramMap.get('accountId');
    const userId = localStorage.getItem('userId');
    if (userId) {
      if (bookId) {
        this.cartService
          .deleteBookFromCart(bookId)
          .pipe(take(1))
          .subscribe((res) => {
            console.log(res);
          });
        this.cartService
          .setBookToHistory(userId, bookId)
          .pipe(take(1))
          .subscribe((res) => {
            console.log(res);
          });
        this.textShow1 = this.translate.instant('SUCCESS.TITLE');
        this.textShow2 = this.translate.instant('SUCCESS.MESSAGE_1');
        this.textShow3 = this.translate.instant('SUCCESS.MESSAGE_2');
      } else if (stripeId) {
        this.stripe.setStripeId(userId, stripeId).subscribe((res) => {
          console.log(res);
        });
        this.textShow1 = this.translate.instant('SUCCESS.SUBSCRIPTION_TITLE');
        this.textShow2 = this.translate.instant('SUCCESS.SUBSCRIPTION_MSG_1');
      }
    }
  }
}
