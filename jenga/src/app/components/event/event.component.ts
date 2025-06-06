/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { CartService } from '@app/services/cart.service';
import { UseBackService } from '@app/services/use-back.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
import { ShowOrganizerDialogComponent } from '../dialogs/show-organizer-dialog/show-organizer-dialog.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-event',
  imports: [HeaderComponent, CommonModule, RouterLink, TranslateModule, FooterComponent],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class EventComponent implements OnInit {
  public eventId: number | null = 0;
  public event: any | null = null;

  userId: number = 0;
  organizerId: number = 0;
  organizerName: string = '';
  public role: string = '';
  public actualUser: string | null = localStorage.getItem('token');
  public eventsList: [] = [];
  public ready = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private useBack: UseBackService,
    private auth: AuthService,
    private cartService: CartService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.auth
      .getUser()
      .pipe(take(1))
      .subscribe((res: any) => {
        this.userId = res.id;
        this.role = res.role;
        console.log(res);
      });
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID del evento:', this.eventId);
    if (this.eventId) {
      this.useBack
        .getEventById(this.eventId)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.event = res;
            this.event = this.event[0];
            console.log(this.event);
          },
          complete: () => {
            this.useBack
              .getUserById(this.event.organizer_id)
              .pipe(take(1))
              .subscribe((res: any) => {
                this.organizerName = res.name;
                this.ready = true;
              });
          }
        });
      if (localStorage.getItem('token')) {
        this.auth.getUser().subscribe({
          next: (user) => {
            this.userId = user.id;
          },
          error: (err) => {
            console.error('Error al obtener usuario', err);
          }
        });
      }
    }
  }

  addToCart(eventId: number) {
    const actualPeople = this.event.codes;
    const maxPeople = this.event.capacity;
    if (this.actualUser && this.role === 'standart') {
      if (actualPeople.length < maxPeople) {
        this.cartService.setEventToCart(eventId, this.userId).subscribe((res: any) => {
          console.log(res);
          alert('Añadido correctamente al carrito');
          this.eventsList = res.cart;
          console.log(this.eventsList);
        });
      } else {
        alert(this.translate.instant('EVENT.MAXCAPACITY'));
      }
    } else if (this.role === 'organizer') {
      alert(this.translate.instant('EVENT.WRONG_USER'));
    } else {
      alert(this.translate.instant('EVENT.WRONG_USER'));
      this.router.navigate(['/register']).then(() => {
        window.scrollTo(0, 0);
      });
    }
  }
  showOrganizerData(organizerId: number) {
    console.log(organizerId);
    this.dialog.open(ShowOrganizerDialogComponent, {
      data: { organizerId: organizerId },
      width: '500px'
    });
  }
}
