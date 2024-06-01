import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AusentismosProcesadosPersonaComponent } from './ausentismos-procesados-persona.component';

describe('AusentismosProcesadosComponent', () => {
  let component: AusentismosProcesadosPersonaComponent;
  let fixture: ComponentFixture<AusentismosProcesadosPersonaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AusentismosProcesadosPersonaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AusentismosProcesadosPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
