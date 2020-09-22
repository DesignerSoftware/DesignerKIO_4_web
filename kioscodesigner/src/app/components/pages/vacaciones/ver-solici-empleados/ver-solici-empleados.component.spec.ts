import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerSoliciEmpleadosComponent } from './ver-solici-empleados.component';

describe('VerSoliciEmpleadosComponent', () => {
  let component: VerSoliciEmpleadosComponent;
  let fixture: ComponentFixture<VerSoliciEmpleadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerSoliciEmpleadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerSoliciEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
