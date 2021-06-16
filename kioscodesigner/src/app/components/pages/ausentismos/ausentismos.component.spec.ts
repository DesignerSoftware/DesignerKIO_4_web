import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AusentismosComponent } from './ausentismos.component';

describe('AusentismosComponent', () => {
  let component: AusentismosComponent;
  let fixture: ComponentFixture<AusentismosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AusentismosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AusentismosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
