import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerSoliciSinProcPersonaComponent } from './ver-solici-sin-proc-persona.component';

describe('VerSoliciSinProcPersonaComponent', () => {
  let component: VerSoliciSinProcPersonaComponent;
  let fixture: ComponentFixture<VerSoliciSinProcPersonaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerSoliciSinProcPersonaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerSoliciSinProcPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
