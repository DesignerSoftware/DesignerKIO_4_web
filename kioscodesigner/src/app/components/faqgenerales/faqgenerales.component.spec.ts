import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FAQGENERALESComponent } from './faqgenerales.component';

describe('FAQGENERALESComponent', () => {
  let component: FAQGENERALESComponent;
  let fixture: ComponentFixture<FAQGENERALESComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FAQGENERALESComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FAQGENERALESComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
