import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormComponent } from '../form/form.component';
import { HeaderComponent } from '../header/header.component';
@Component({
  selector: 'app-edit-book',
  imports: [HeaderComponent, CommonModule, FormsModule, FormComponent, TranslateModule],
  templateUrl: './edit-book.component.html',
  styleUrl: './edit-book.component.scss'
})
export class EditBookComponent {
  public useFunction: string = 'editBook';
  constructor() {}
}
