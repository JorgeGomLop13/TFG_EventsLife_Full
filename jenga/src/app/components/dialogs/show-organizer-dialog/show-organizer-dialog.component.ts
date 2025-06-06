/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UseBackService } from '@app/services/use-back.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-show-organizer-dialog',
  imports: [MatDialogModule, TranslateModule],
  templateUrl: './show-organizer-dialog.component.html',
  styleUrl: './show-organizer-dialog.component.scss'
})
export class ShowOrganizerDialogComponent implements OnInit {
  public organizerId: number = 0;
  public nombreOrganizador: string = '';
  public emailOrganizador: string = '';
  public telefonoOrganizador: string = '';
  public calleOrganizador: string = '';

  constructor(
    public dialogRef: MatDialogRef<ShowOrganizerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private useData: UseBackService
  ) {}

  ngOnInit() {
    this.organizerId = this.data.organizerId;
    console.log(this.organizerId);
    this.useData.getUserById(this.organizerId).subscribe((res: any) => {
      this.nombreOrganizador = res.name;
      this.emailOrganizador = res.email;
      this.telefonoOrganizador = res.phone;
      this.calleOrganizador = res.address;
    });
  }
}
