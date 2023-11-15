import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerSoliciSinProcPersonaComponent } from './ver-solici-sin-proc-persona.component';

describe('VerSoliciSinProcPersonaComponent', () => {
  let component: VerSoliciSinProcPersonaComponent;
  let fixture: ComponentFixture<VerSoliciSinProcPersonaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerSoliciSinProcPersonaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerSoliciSinProcPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
