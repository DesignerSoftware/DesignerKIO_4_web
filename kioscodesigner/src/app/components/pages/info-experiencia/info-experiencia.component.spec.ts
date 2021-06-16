import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoExperienciaComponent } from './info-experiencia.component';

describe('InfoExperienciaComponent', () => {
  let component: InfoExperienciaComponent;
  let fixture: ComponentFixture<InfoExperienciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoExperienciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoExperienciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
