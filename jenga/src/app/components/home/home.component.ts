/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '@app/services/cart.service';
import { UseBackService } from '@app/services/use-back.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { take } from 'rxjs';
import { HeaderComponent } from '../header/header.component';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [HeaderComponent, CommonModule, NgxPaginationModule, TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public books: any[] = [];
  public page: number = 1;
  public currentPage = 1;
  public limit = 3;
  public totalPages = 0;
  public hasNextPage = false;
  public hasPrevPage = false;

  public actualUser: string | null = localStorage.getItem('token');
  public role: string | null = localStorage.getItem('role');

  public booksList: [] = [];

  images = ['assets/libroCarrusel1.jpeg', 'assets/bookOpen.jpg', 'assets/librery.jpeg', 'assets/bookTogether.jpeg'];
  currentIndex = 0;
  intervalId: any;

  constructor(
    private useData: UseBackService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private route: Router
  ) {}

  ngOnInit() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.useData
      .getBooks()
      .pipe(take(1))
      .subscribe((data: any) => {
        this.books = data;
      });
    this.startAutoSlide();
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

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.next();
      this.cdr.detectChanges(); // Forzamos detección para que Angular refresque el template
    }, 4000);
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
