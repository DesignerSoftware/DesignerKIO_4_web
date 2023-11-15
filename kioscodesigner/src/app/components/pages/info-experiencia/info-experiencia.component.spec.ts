import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoExperienciaComponent } from './info-experiencia.component';

describe('InfoExperienciaComponent', () => {
  let component: InfoExperienciaComponent;
  let fixture: ComponentFixture<InfoExperienciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoExperienciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoExperienciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
