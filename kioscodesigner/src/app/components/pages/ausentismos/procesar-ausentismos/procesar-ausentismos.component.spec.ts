import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesarAusentismosComponent } from './procesar-ausentismos.component';

describe('ProcesarAusentismosComponent', () => {
  let component: ProcesarAusentismosComponent;
  let fixture: ComponentFixture<ProcesarAusentismosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcesarAusentismosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcesarAusentismosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
