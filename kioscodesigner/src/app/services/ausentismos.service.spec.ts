import { TestBed } from '@angular/core/testing';

import { AusentismosService } from './ausentismos.service';

describe('AusentismosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AusentismosService = TestBed.get(AusentismosService);
    expect(service).toBeTruthy();
  });
});
