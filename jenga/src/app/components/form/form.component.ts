/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { UseBackService } from '@app/services/use-back.service';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs';

@Component({
  selector: 'app-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit {
  public categories: any[] = [];
  public eventName: string = '';
  public eventOrganizerId: string = '';
  public eventCategoryId: string = '';
  public eventImage: string = '';
  public eventDescription: string = '';
  public eventDate: string = '';
  public eventTimeStart: string = '';
  public eventTimeEnd: string = '';
  public eventLocation: string = '';
  public eventPrice: number = 0;
  public eventCapacity: number = 0;
  public freeEvent: boolean = false;

  eventID = Number(this.route.snapshot.paramMap.get('id'));

  public eventImagePreview: string | ArrayBuffer | null = null;

  public errorMessage: string = '';

  @Input() useFunction: string = '';

  protected readonly form = inject(FormBuilder).group({
    eventName: ['', Validators.required],
    eventCategoryId: ['', Validators.required],
    eventCapacity: [1, [Validators.required, Validators.min(1)]],
    eventDescription: ['', Validators.required],
    eventDate: ['', Validators.required],
    eventTimeEnd: ['', Validators.required],
    eventTimeStart: ['', Validators.required],
    eventLocation: ['', Validators.required],
    eventPrice: [0, [Validators.required, Validators.min(0)]]
  });

  constructor(private useBack: UseBackService, private router: Router, private route: ActivatedRoute, private auth: AuthService) {
    this.auth.getUser().subscribe((user: any) => {
      this.eventOrganizerId = user.id;
    });
  }

  ngOnInit(): void {
    this.useBack.getCategories().subscribe((data: any) => {
      this.categories = data;
    });

    if (this.useFunction === 'editEvent') {
      console.log(this.eventID);
      this.useBack
        .getEventById(this.eventID)
        .pipe(take(1))
        .subscribe((res: any) => {
          const event = res[0];
          this.form.patchValue({
            eventName: event.name,
            eventCategoryId: event.category_id,
            eventCapacity: event.capacity,
            eventDescription: event.description,
            eventDate: event.date,
            eventTimeStart: event.start_date?.slice(0, 5),
            eventTimeEnd: event.end_date?.slice(0, 5),
            eventLocation: event.location,
            eventPrice: event.price
          });
          this.eventImagePreview = event.image;
          this.eventImage = event.image;
        });
    }
    console.log(this.eventImage.length);
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.eventImage = reader.result as string;
        this.eventImagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onCheckboxChange() {
    this.freeEvent = !this.freeEvent;
    const control = this.form.get('eventPrice');
    if (this.freeEvent) {
      control?.setValue(0);
    }

    control?.updateValueAndValidity();
  }
  // Reutilizo el mismo form para creear y editar libros ya que son los mismos campos
  // Por lo tanto uso una función para decidir si crear o editar el libro
  // con un parametro que paso desde el componente en el que se esté utilizando

  selectFunction() {
    if (this.useFunction === 'createEvent') {
      this.createEvent();
    } else if (this.useFunction === 'editEvent') {
      this.updateEvent();
    }
  }

  createEvent() {
    const event = {
      name: this.form.value.eventName,
      organizer_id: this.eventOrganizerId,
      category_id: this.form.value.eventCategoryId,
      image: this.eventImage,
      description: this.form.value.eventDescription,
      date: this.form.value.eventDate,
      start_date: this.form.value.eventTimeStart,
      end_date: this.form.value.eventTimeEnd,
      location: this.form.value.eventLocation,
      price: this.form.value.eventPrice,
      capacity: this.form.value.eventCapacity
    };
    this.useBack
      .createEvent(event)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.errorMessage = error?.error?.errorCode;
          setTimeout(() => {
            this.errorMessage = '';
          }, 8000);
        }
      });
  }

  updateEvent() {
    //Si es actualizar se quita la validación de que todos los campos son requeridos

    const rawEvent = {
      name: this.form.value.eventName,
      organizer_id: this.eventOrganizerId,
      category_id: this.form.value.eventCategoryId,
      image: this.eventImage,
      description: this.form.value.eventDescription,
      date: this.form.value.eventDate,
      start_date: this.form.value.eventTimeStart,
      end_date: this.form.value.eventTimeEnd,
      location: this.form.value.eventLocation,
      price: this.form.value.eventPrice,
      capacity: this.form.value.eventCapacity
    };

    //Para mandar solo lo que se haya modificado
    const event: any = {};
    Object.entries(rawEvent).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        event[key] = value;
      }
    });

    const eventID = Number(this.route.snapshot.paramMap.get('id'));

    if (eventID === null) {
      console.error('ID del libro no encontrado');
      return;
    }
    this.useBack
      .updateEvent(eventID, event)
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['/home']);
      });
  }
}
