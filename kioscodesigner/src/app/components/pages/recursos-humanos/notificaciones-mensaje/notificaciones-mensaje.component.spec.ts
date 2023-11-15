import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionesMensajeComponent } from './notificaciones-mensaje.component';

describe('NotificacionesMensajeComponent', () => {
  let component: NotificacionesMensajeComponent;
  let fixture: ComponentFixture<NotificacionesMensajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificacionesMensajeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificacionesMensajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
