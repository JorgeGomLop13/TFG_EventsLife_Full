import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  imports: [TranslateModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  constructor(private router: Router) {}
  goToSearch() {
    const current = this.router.url;
    console.log(current);
    if (current === '/search') {
      location.reload();
    } else {
      this.router.navigate(['/search']);
    }
  }

  goToTerms() {
    const current = this.router.url;
    console.log(current);
    if (current === '/terms-and-conditions') {
      location.reload();
    } else {
      this.router.navigate(['/terms-and-conditions']);
    }
  }
  goToQuestions() {
    const current = this.router.url;
    console.log(current);
    if (current === '/frequent-questions') {
      location.reload();
    } else {
      this.router.navigate(['/frequent-questions']);
    }
  }
}
