import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UseBackService } from '@app/services/use-back.service';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs';

@Component({
  selector: 'app-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  public bookAuthor: string = localStorage.getItem('userName') || '';
  public bookImage: string = '';
  public bookImagePreview: string | ArrayBuffer | null = null;
  public errorMessage: string = '';

  @Input() useFunction: string = '';

  protected readonly form = inject(FormBuilder).group({
    bookName: ['', [Validators.required]],
    bookDescription: ['', [Validators.required]],
    bookPrice: [1, [Validators.required, Validators.min(1)]],
    bookPages: [1, [Validators.required, Validators.min(1)]]
  });

  constructor(private useBack: UseBackService, private router: Router, private route: ActivatedRoute) {}

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.bookImage = reader.result as string;
        this.bookImagePreview = reader.result; // para mostrarla en vista previa
      };
      reader.readAsDataURL(file); // convierte la imagen a base64
    }
  }
  // Reutilizo el mismo form para creear y editar libros ya que son los mismos campos
  // Por lo tanto uso una función para decidir si crear o editar el libro
  // con un parametro que paso desde el componente en el que se esté utilizando

  selectFunction() {
    if (this.useFunction === 'createBook') {
      this.createBook();
    } else if (this.useFunction === 'editBook') {
      this.updateBook();
    }
  }

  createBook() {
    const book = {
      name: this.form.get('bookName')?.getRawValue(),
      author: this.bookAuthor,
      author_id: localStorage.getItem('userId') || '',
      description: this.form.get('bookDescription')?.getRawValue(),
      image: this.bookImage,
      price: this.form.get('bookPrice')?.getRawValue(),
      pages: this.form.get('bookPages')?.getRawValue()
    };
    this.useBack
      .createBook(book)
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['/home']);
      });
  }

  updateBook() {
    const book = {
      name: this.form.get('bookName')?.getRawValue(),
      author: this.bookAuthor,
      author_id: localStorage.getItem('userId') || '',
      description: this.form.get('bookDescription')?.getRawValue(),
      image: this.bookImage,
      price: this.form.get('bookPrice')?.getRawValue(),
      pages: this.form.get('bookPages')?.getRawValue()
    };
    const bookId = this.route.snapshot.paramMap.get('id');
    console.log('ID del libro:', bookId);
    if (bookId === null) {
      console.error('ID del libro no encontrado');
      return;
    }
    this.useBack
      .updateBook(bookId, book)
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['/home']);
      });
  }
}
