import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-terms-and-conditions',
  imports: [TranslateModule],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.scss'
})
export class TermsAndConditionsComponent {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
