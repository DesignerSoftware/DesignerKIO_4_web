import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerAusentismosReportadosComponent } from './ver-ausentismos-reportados.component';

describe('VerAusentismosReportadosComponent', () => {
  let component: VerAusentismosReportadosComponent;
  let fixture: ComponentFixture<VerAusentismosReportadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerAusentismosReportadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerAusentismosReportadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
