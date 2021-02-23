import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoEstudiosComponent } from './info-estudios.component';

describe('InfoEstudiosComponent', () => {
  let component: InfoEstudiosComponent;
  let fixture: ComponentFixture<InfoEstudiosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoEstudiosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoEstudiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
