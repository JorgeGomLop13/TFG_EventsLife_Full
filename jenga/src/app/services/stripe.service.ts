import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class StripeService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  createStripeAccount() {
    return this.http.post(`${this.apiUrl}/createAccountStripe`, {
      userId: localStorage.getItem('userId')
    });
  }

  payProduct(productTitle: string, productPrice: number, sellerStripeId: string, productId: string, userId: string) {
    return this.http.post(`${this.apiUrl}/payProduct`, {
      productTitle: productTitle,
      productPrice: productPrice,
      sellerStripeId: sellerStripeId,
      productId: productId,
      userId: userId
    });
  }

  setStripeId(userId: string, userStripeId: string) {
    return this.http.post(`${this.apiUrl}/setStripeId`, {
      userId: userId,
      stripeId: userStripeId
    });
  }
}
