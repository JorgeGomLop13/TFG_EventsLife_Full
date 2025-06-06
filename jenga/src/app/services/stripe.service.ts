import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ENV } from '@app/core/constants/global.constants';
import { Env } from '@app/core/types/env';

@Injectable()
export class StripeService {
  constructor(private http: HttpClient, @Inject(ENV) private env: Env) {}

  createStripeAccount(userId: number) {
    return this.http.post(`${this.env.apiBaseUrl}/createAccountStripe`, {
      userId: userId
    });
  }

  payProduct(productTitle: string, productPrice: number, sellerStripeId: string, productId: number) {
    return this.http.post(`${this.env.apiBaseUrl}/payProduct`, {
      productTitle: productTitle,
      productPrice: productPrice,
      sellerStripeId: sellerStripeId,
      productId: productId
    });
  }

  setStripeId(userId: number, userStripeId: string) {
    return this.http.post(`${this.env.apiBaseUrl}/setStripeId`, {
      userId: userId,
      stripeId: userStripeId
    });
  }
}
