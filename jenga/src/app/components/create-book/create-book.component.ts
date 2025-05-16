/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UseBackService } from '@app/services/use-back.service';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs';
import { FormComponent } from '../form/form.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-create-book',
  imports: [HeaderComponent, CommonModule, FormsModule, FormComponent, TranslateModule],
  templateUrl: './create-book.component.html',
  styleUrl: './create-book.component.scss'
})
export class CreateBookComponent implements OnInit {
  public useFunction: string = 'createBook';

  public userId = localStorage.getItem('userId');
  public userStripeId: string = '';

  constructor(private useBack: UseBackService, private router: Router) {}

  ngOnInit(): void {
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
  }
}
