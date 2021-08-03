import { TestBed, async, inject } from '@angular/core/testing';

import { InfomacionGuard } from './infomacion.guard';

describe('InfomacionGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InfomacionGuard]
    });
  });

  it('should ...', inject([InfomacionGuard], (guard: InfomacionGuard) => {
    expect(guard).toBeTruthy();
  }));
});
