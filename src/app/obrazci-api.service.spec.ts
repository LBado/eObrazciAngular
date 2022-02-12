import { TestBed } from '@angular/core/testing';

import { ObrazciApiService } from './obrazci-api.service';

describe('ObrazciApiService', () => {
  let service: ObrazciApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObrazciApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
