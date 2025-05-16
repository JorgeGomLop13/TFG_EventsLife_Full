import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, signal } from '@angular/core';
import { ENV } from '@app/core/constants/global.constants';
import { Book } from '@app/core/types/book';
import { Env } from '@app/core/types/env';
import { JwtPayload } from '@app/core/types/jwt-payload';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UseBackService {
  email = signal<string | null>(null);

  constructor(private http: HttpClient, @Inject(ENV) private env: Env) {
    this.setUserInfoIfTokenExists();
  }
  setUserInfoIfTokenExists() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.decodeToken(token);
      this.email.set(decodedToken.email);
    }
  }
  decodeToken(token: string) {
    return jwtDecode<JwtPayload>(token);
  }

  getUsers() {
    return this.http.get(`${this.env.apiBaseUrl}/users`);
  }

  getUserById(id: string) {
    return this.http.get(`${this.env.apiBaseUrl}/entities/${id}?table=users`);
  }

  createBook(book: Book) {
    return this.http.post(`${this.env.apiBaseUrl}/entities?table=books`, book);
  }
  getBooks() {
    return this.http.get(`${this.env.apiBaseUrl}/entities?table=books`);
  }

  getPaginatedBooks(page: number, limit: number, search?: string) {
    if (!search) {
      return this.http.get(`${this.env.apiBaseUrl}/paginated-entities?table=books&page=${page}&limit=${limit}`);
    }
    return this.http.get(`${this.env.apiBaseUrl}/paginated-entities?table=books&page=${page}&limit=${limit}&search=${search}`);
  }

  getBookById(id: string) {
    return this.http.get(`${this.env.apiBaseUrl}/booksAccount/${id}`);
  }

  updateBook(id: string, book: Book) {
    return this.http.put(`${this.env.apiBaseUrl}/entities/${id}?table=books`, book);
  }

  deleteBook(id: string) {
    return this.http.delete(`${this.env.apiBaseUrl}/entities/${id}?table=books`);
  }
}
