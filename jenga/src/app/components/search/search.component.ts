/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { CartService } from '@app/services/cart.service';
import { UseBackService } from '@app/services/use-back.service';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-search',
  imports: [HeaderComponent, FormsModule, CommonModule, TranslateModule, RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  public searchTerm: string = '';
  public searchResults: any[] = [];

  constructor(
    private useData: UseBackService,
    private cartService: CartService,
    private route: Router,
    private auth: AuthService
  ) {}

  events: any[] = [];
  currentPage = 1;
  limit = 3;
  totalPages = 0;
  hasNextPage = false;
  hasPrevPage = false;

  public eventsList: [] = [];
  public token = localStorage.getItem('token');

  public actualUser: string = '';
  public userRole: string = '';
  public userId: number = 0;

  ngOnInit(): void {
    if (this.token) {
      this.auth
        .getUser()
        .pipe(take(1))
        .subscribe((res: any) => {
          this.userRole = res.role;
          this.userId = res.id;
          this.getEvents(this.currentPage);
        });
    } else {
      this.getEvents(this.currentPage);
    }
  }

  getEvents(page: number) {
    this.useData
      .getEvents(page, this.limit)
      .pipe(take(1))
      .subscribe((res: any) => {
        this.events = res.data;
        this.currentPage = res.current_page;
        this.totalPages = res.last_page;
        this.hasNextPage = res.current_page < res.last_page;
        this.hasPrevPage = res.current_page > 1;
        console.log(this.events);

        this.events.map((event) =>
          this.useData
            .getUserById(event.organizer_id)
            .pipe(take(1))
            .subscribe((res: any) => {
              event.organizer = res.name;
            })
        );
      });
  }

  searchEvents() {
    if (this.searchTerm) {
      this.useData
        .getPaginatedEvents(this.currentPage, this.limit, this.searchTerm)
        .pipe(take(1))
        .subscribe((res: any) => {
          this.events = res.data;
          this.currentPage = res.current_page;
          this.totalPages = res.last_page;
          this.hasNextPage = res.current_page < res.last_page;
          this.hasPrevPage = res.current_page > 1;
        });
    }
  }

  addToCart(eventId: number) {
    if (this.actualUser && this.userRole === 'reader') {
      this.cartService.setEventToCart(this.userId, eventId).subscribe((res: any) => {
        console.log(res);
        alert('Añadido correctamente al carrito');
        this.eventsList = res.events;
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
