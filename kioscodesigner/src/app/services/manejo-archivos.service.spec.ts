import { TestBed } from '@angular/core/testing';

import { ManejoArchivosService } from './manejo-archivos.service';

describe('ManejoArchivosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManejoArchivosService = TestBed.get(ManejoArchivosService);
    expect(service).toBeTruthy();
  });
});
