/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { UseBackService } from '@app/services/use-back.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent implements OnInit {
  public eventImage: string = '';
  public eventImagePreview: string | ArrayBuffer | null = null;

  public suposedId: number = 0;
  public idGet: number = 0;
  public updatedUser: any = {};

  protected readonly editUserForm = inject(FormBuilder).group({
    name: ['']
  });

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
    private useBack: UseBackService
  ) {}
  ngOnInit(): void {
    this.idGet = Number(this.route.snapshot.paramMap.get('id'));
    this.auth.getUser().subscribe((res: any) => {
      this.suposedId = res.id;
      if (this.idGet !== this.suposedId) {
        alert('No tienes permiso para editar este perfil' + this.idGet + ' el tuyo es ' + this.suposedId);
        this.router.navigate(['/profile']);
      }
    });
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

  onSubmit(): void {
    this.updatedUser = {};

    if (this.editUserForm.value.name) {
      this.updatedUser.name = this.editUserForm.value.name;
    }

    if (this.eventImage) {
      this.updatedUser.image = this.eventImage;
    }

    if (Object.keys(this.updatedUser).length === 0) {
      alert('No hay cambios para actualizar.');
      return;
    }

    this.useBack
      .updateUser(this.idGet, this.updatedUser)
      .pipe(take(1))
      .subscribe((response: any) => {
        console.log('Usuario actualizado correctamente:', response);
        alert('Usuario actualizado correctamente');
        this.router.navigate(['/profile']).then(() => {});
      });
  }
}
