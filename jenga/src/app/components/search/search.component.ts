/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '@app/services/cart.service';
import { UseBackService } from '@app/services/use-back.service';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-search',
  imports: [HeaderComponent, FormsModule, CommonModule, TranslateModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  public searchTerm: string = '';
  public searchResults: any[] = [];

  constructor(private useData: UseBackService, private cartService: CartService, private route: Router) {}

  books: any[] = [];
  currentPage = 1;
  limit = 3;
  totalPages = 0;
  hasNextPage = false;
  hasPrevPage = false;

  public booksList: [] = [];

  public actualUser: string | null = localStorage.getItem('token');
  public role: string | null = localStorage.getItem('role');

  ngOnInit(): void {
    this.getBooks(this.currentPage);
  }

  getBooks(page: number) {
    this.useData
      .getPaginatedBooks(page, this.limit)
      .pipe(take(1))
      .subscribe((res: any) => {
        this.books = res.entities;
        this.currentPage = res.pagination.page;
        this.totalPages = res.pagination.totalPages;
        this.hasNextPage = res.pagination.hasNextPage;
        this.hasPrevPage = res.pagination.hasPrevPage;
      });
  }

  searchBooks() {
    if (this.searchTerm) {
      this.useData
        .getPaginatedBooks(this.currentPage, this.limit, this.searchTerm)
        .pipe(take(1))
        .subscribe((res: any) => {
          this.books = res.entities;
          this.currentPage = res.pagination.page;
          this.totalPages = res.pagination.totalPages;
          this.hasNextPage = res.pagination.hasNextPage;
          this.hasPrevPage = res.pagination.hasPrevPage;
        });
    }
  }

  addToCart(bookId: string) {
    if (this.actualUser && this.role === 'reader') {
      this.cartService.setBookToCart(bookId).subscribe((res: any) => {
        console.log(res);
        alert('Añadido correctamente al carrito');
        this.booksList = res.books;
      });
    } else {
      this.route.navigate(['/register']).then(() => {
        window.scrollTo(0, 0);
      });
    }
  }

  reset() {
    location.reload();
  }
}
