import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarMensajeComponent } from './consultar-mensaje.component';

describe('ConsultarMensajeComponent', () => {
  let component: ConsultarMensajeComponent;
  let fixture: ComponentFixture<ConsultarMensajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarMensajeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarMensajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
