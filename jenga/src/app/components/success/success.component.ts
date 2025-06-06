/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { CartService } from '@app/services/cart.service';
import { StripeService } from '@app/services/stripe.service';
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

  public bookFollowCode: string = '';

  public userId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private stripe: StripeService,
    private cartService: CartService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const eventId: number = Number(this.route.snapshot.paramMap.get('productId'));
    const stripeId = this.route.snapshot.paramMap.get('accountId');
    this.auth
      .getUser()
      .pipe(take(1))
      .subscribe((res: any) => {
        this.userId = res.id;
        if (this.userId) {
          if (eventId) {
            this.cartService
              .deleteEventFromCart(this.userId, eventId)
              .pipe(take(1))
              .subscribe((res) => {
                console.log(res);
              });
            this.cartService
              .setEventToHistory(this.userId, eventId)
              .pipe(take(1))
              .subscribe((res: any) => {
                console.log(res);
                this.bookFollowCode = res.followCode;
                console.log(this, this.bookFollowCode);
                if (this.bookFollowCode) {
                  this.cartService
                    .sendEmail(
                      this.translate.instant('SUCCESS.SUBJECT'),
                      this.translate.instant('SUCCESS.HTML') + this.bookFollowCode,
                      'jgomezlop13@gmail.com'
                    )
                    .pipe(take(1))
                    .subscribe((res) => {
                      console.log(res);
                    });
                  this.cartService
                    .setCodeToEvent(eventId, this.bookFollowCode)
                    .pipe(take(1))
                    .subscribe((res) => {
                      console.log(res);
                    });
                }
              });
            this.textShow1 = this.translate.instant('SUCCESS.TITLE');
            this.textShow2 = this.translate.instant('SUCCESS.MESSAGE_1');
            this.textShow3 = this.translate.instant('SUCCESS.MESSAGE_2');
          } else if (stripeId) {
            console.log('Llega');
            this.stripe.setStripeId(this.userId, stripeId).subscribe((res) => {
              console.log(res);
            });
            this.textShow1 = this.translate.instant('SUCCESS.SUBSCRIPTION_TITLE');
            this.textShow2 = this.translate.instant('SUCCESS.SUBSCRIPTION_MSG_1');
          }
        }
      });
  }
}
