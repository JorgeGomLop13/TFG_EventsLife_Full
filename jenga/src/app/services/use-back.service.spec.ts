import { TestBed } from '@angular/core/testing';

import { UseBackService } from './use-back.service';

describe('UseBackService', () => {
  let service: UseBackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UseBackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
