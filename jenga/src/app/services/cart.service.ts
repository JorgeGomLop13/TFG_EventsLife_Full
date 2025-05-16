import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ENV } from '@app/core/constants/global.constants';
import { Env } from '@app/core/types/env';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private http: HttpClient, @Inject(ENV) private env: Env) {}

  setBookToCart(bookId: string) {
    const userId = localStorage.getItem('userId');
    return this.http.get(`${this.env.apiBaseUrl}/users/${userId}/books/${bookId}`);
  }

  getCartBooksByIds() {
    const userId = localStorage.getItem('userId');
    return this.http.get(`${this.env.apiBaseUrl}/booksFromIds/${userId}`);
  }
  getHistoryBooksByIds() {
    const userId = localStorage.getItem('userId');
    return this.http.get(`${this.env.apiBaseUrl}/history/${userId}`);
  }

  deleteBookFromCart(bookId: string) {
    const userId = localStorage.getItem('userId');
    return this.http.get(`${this.env.apiBaseUrl}/profile/${userId}/books/${bookId}`);
  }

  setBookToHistory(userId: string, bookId: string) {
    return this.http.post(`${this.env.apiBaseUrl}/setBookToHistory`, {
      userId: userId,
      bookId: bookId
    });
  }
}
