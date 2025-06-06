/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { CartService } from '@app/services/cart.service';
import { StripeService } from '@app/services/stripe.service';
import { UseBackService } from '@app/services/use-back.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink, TranslateModule, HeaderComponent, FooterComponent],
  providers: [StripeService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  public userId: number = 0;
  public userName: string = '';
  public userEmail: string = '';
  public userRole: string = '';
  public userHistory: number[] = [];
  public userStripeId: string = '';
  public image: string = '';

  public userEvents: any[] = [];

  public eventsInCart: any[] = [];
  public eventsInHistory: any[] = [];

  public ready = false;

  constructor(
    private useData: UseBackService,
    private auth: AuthService,
    private stripe: StripeService,
    private cartService: CartService,
    private translate: TranslateService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.auth
      .getUser()
      .pipe(take(1))
      .subscribe((res: any) => {
        this.userName = res.name;
        this.userRole = res.role;
        this.userId = res.id;
        this.userEmail = res.email;
        this.userStripeId = res.stripeAccountId;
        this.image = res.image;
        console.log(res);
        if (this.userRole === 'organizer') {
          this.useData
            .getEventByOrganizer(this.userId)
            .pipe(take(1))
            .subscribe((res: any) => {
              this.userEvents = res;
            });
        }
        if (this.userId && this.userRole === 'standart') {
          this.useData
            .getUserById(this.userId)
            .pipe(take(1))
            .subscribe((res: any) => {
              this.userHistory = res.history;
              console.log(this.userHistory);
              this.cartService
                .getHistoryEventsByIds(this.userId)
                .pipe(take(1))
                .subscribe((res: any) => {
                  this.eventsInHistory = res.events;
                });
            });
        }
      });
  }
  deleteEventWithDialog(eventId: number, codes: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteEvent(eventId, codes);
      }
    });
  }

  deleteEvent(id: number, codes: [string]) {
    if (codes.length > 0) {
      alert(this.translate.instant('PROFILE.NODELETE'));
      return;
    }
    this.useData
      .deleteEvent(id)
      .pipe(take(1))
      .subscribe(() => {});
    this.userEvents = this.userEvents.filter((event) => event.id !== id);
  }

  createStripeAccount() {
    this.stripe.createStripeAccount(this.userId).subscribe((res: any) => {
      window.location.href = res.url;
    });
  }

  getCodes(id: number) {
    const language = localStorage.getItem('lang') || 'es';
    this.useData.getEventCodes(id, language).subscribe({
      next: (pdfBlob: Blob) => {
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.translate.instant('PROFILE.pdf_title')}_${id}.pdf`;
        a.click();
      },
      error: (err) => {
        const reader = new FileReader();
        reader.onload = () => {
          console.error('Error (contenido):', reader.result);
        };
        reader.readAsText(err.error);
      }
    });
  }

  goToEditProfile() {
    this.router.navigate([`/editUser/${this.userId}`]).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  logout() {
    this.auth.logout();
  }
}
