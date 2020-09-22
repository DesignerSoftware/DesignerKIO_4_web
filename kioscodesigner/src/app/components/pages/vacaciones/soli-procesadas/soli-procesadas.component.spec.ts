import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoliProcesadasComponent } from './soli-procesadas.component';

describe('SoliProcesadasComponent', () => {
  let component: SoliProcesadasComponent;
  let fixture: ComponentFixture<SoliProcesadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoliProcesadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoliProcesadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
