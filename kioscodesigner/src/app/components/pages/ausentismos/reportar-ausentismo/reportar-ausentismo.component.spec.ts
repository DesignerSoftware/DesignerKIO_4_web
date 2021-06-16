import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportarAusentismoComponent } from './reportar-ausentismo.component';

describe('ReportarAusentismoComponent', () => {
  let component: ReportarAusentismoComponent;
  let fixture: ComponentFixture<ReportarAusentismoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportarAusentismoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportarAusentismoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
