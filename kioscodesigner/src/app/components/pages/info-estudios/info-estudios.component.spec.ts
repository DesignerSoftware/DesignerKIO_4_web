import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoEstudiosComponent } from './info-estudios.component';

describe('InfoEstudiosComponent', () => {
  let component: InfoEstudiosComponent;
  let fixture: ComponentFixture<InfoEstudiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoEstudiosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoEstudiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
