import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerSoliciEmpleadosComponent } from './ver-solici-empleados.component';

describe('VerSoliciEmpleadosComponent', () => {
  let component: VerSoliciEmpleadosComponent;
  let fixture: ComponentFixture<VerSoliciEmpleadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerSoliciEmpleadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerSoliciEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
