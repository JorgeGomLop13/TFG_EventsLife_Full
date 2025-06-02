/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { UseBackService } from '@app/services/use-back.service';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs';
import { FormComponent } from '../form/form.component';

@Component({
  selector: 'app-create-event',
  imports: [CommonModule, FormsModule, FormComponent, TranslateModule],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss'
})
export class CreateEventComponent implements OnInit {
  public useFunction: string = 'createEvent';
  public token: string | null = localStorage.getItem('token');
  public userName: string | null = '';
  public userRole: string | null = '';

  public userId: number = 0;
  public userStripeId: string = '';

  constructor(private useBack: UseBackService, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.token) {
      this.auth
        .getUser()
        .pipe(take(1))
        .subscribe((res: any) => {
          this.userName = res.name;
          this.userRole = res.role;
          this.userId = res.id;
          if (this.userId) {
            this.useBack
              .getUserById(this.userId)
              .pipe(take(1))
              .subscribe((res: any) => {
                this.userStripeId = res.stripeAccountId;
                if (!this.userStripeId) {
                  alert('Tienes que vincular tu cuenta de Stripe para poder crear un evento');
                  this.router.navigate(['/profile']);
                }
              });
          }
        });
    }
  }
}
