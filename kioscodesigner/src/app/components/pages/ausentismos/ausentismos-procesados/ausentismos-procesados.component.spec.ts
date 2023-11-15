import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AusentismosProcesadosComponent } from './ausentismos-procesados.component';

describe('AusentismosProcesadosComponent', () => {
  let component: AusentismosProcesadosComponent;
  let fixture: ComponentFixture<AusentismosProcesadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AusentismosProcesadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AusentismosProcesadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
