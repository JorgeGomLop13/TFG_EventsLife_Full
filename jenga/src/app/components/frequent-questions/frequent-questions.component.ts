import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-frequent-questions',
  imports: [TranslateModule],
  templateUrl: './frequent-questions.component.html',
  styleUrl: './frequent-questions.component.scss'
})
export class FrequentQuestionsComponent {
  constructor(private location: Location) {}
  goBack(): void {
    this.location.back();
  }
}
