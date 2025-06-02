/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { CartService } from '@app/services/cart.service';
import { UseBackService } from '@app/services/use-back.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { take } from 'rxjs';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [HeaderComponent, CommonModule, NgxPaginationModule, TranslateModule, RouterLink, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('eventSection') eventSection!: ElementRef;

  public events: any[] = [];
  public page: number = 1;
  public currentPage = 1;
  public limit = 3;
  public totalPages = 1;
  public hasNextPage = false;
  public hasPrevPage = false;
  public token = localStorage.getItem('token');

  public actualUser: string = '';
  public role: string = '';
  public userId: number = 0;
  public eventsList: [] = [];
  public isTextVisible = true;

  images = ['assets/eventCarrusel_1.webp', 'assets/cafeteria.jpg', 'assets/pintar.jpg', 'assets/vino.jpg'];
  textImage = ['IMAGESUBTEXT1', 'IMAGESUBTEXT2', 'IMAGESUBTEXT1', 'IMAGESUBTEXT2'];
  currentIndex = 0;
  intervalId: any;

  constructor(
    private useData: UseBackService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private route: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (this.token) {
      this.auth
        .getUser()
        .pipe(take(1))
        .subscribe((res: any) => {
          this.role = res.role;
          console.log(this.role);
          this.userId = res.id;
          this.getEvents(this.currentPage);
        });
    }
    this.getEvents(this.currentPage);
    this.startAutoSlide();
  }

  getEvents(page: number, button?: boolean) {
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
        if (this.totalPages === 0) {
          this.totalPages = 1;
        }
        this.events.map((event) =>
          this.useData
            .getUserById(event.organizer_id)
            .pipe(take(1))
            .subscribe((res: any) => {
              event.organizer = res.name;
              if (button) {
                this.scrollToEvents();
              }
            })
        );
      });
  }

  addToCart(eventId: number) {
    if (this.actualUser && this.role === 'reader') {
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

  deleteEvent(id: number) {
    this.useData
      .deleteEvent(id)
      .pipe(take(1))
      .subscribe((res) => {
        console.log(res);
        this.events = this.events.filter((event) => event.id !== id);
      });
  }
  deleteEventAndUser(eventId: number, id: number) {
    this.useData
      .deleteEvent(eventId)
      .pipe(take(1))
      .subscribe((res) => {
        console.log(res);
        this.events = this.events.filter((event) => event.id !== eventId);
      });
    this.useData
      .deleteUser(id)
      .pipe(take(1))
      .subscribe((res) => {
        console.log(res);
      });
  }
  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.next();
      this.cdr.detectChanges();
    }, 5000);
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  scrollToEvents() {
    this.eventSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
