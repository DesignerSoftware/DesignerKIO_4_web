import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioFotoComponent } from './cambio-foto.component';

describe('CambioFotoComponent', () => {
  let component: CambioFotoComponent;
  let fixture: ComponentFixture<CambioFotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambioFotoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioFotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
