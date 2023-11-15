import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerSoliciProcPersonaComponent } from './ver-solici-proc-persona.component';

describe('VerSoliciProcPersonaComponent', () => {
  let component: VerSoliciProcPersonaComponent;
  let fixture: ComponentFixture<VerSoliciProcPersonaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerSoliciProcPersonaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerSoliciProcPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
