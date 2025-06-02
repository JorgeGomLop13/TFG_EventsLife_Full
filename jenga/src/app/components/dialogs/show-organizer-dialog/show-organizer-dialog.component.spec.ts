import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowOrganizerDialogComponent } from './show-organizer-dialog.component';

describe('ShowOrganizerDialogComponent', () => {
  let component: ShowOrganizerDialogComponent;
  let fixture: ComponentFixture<ShowOrganizerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowOrganizerDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowOrganizerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
