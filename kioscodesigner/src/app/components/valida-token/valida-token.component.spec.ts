import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidaTokenComponent } from './valida-token.component';

describe('ValidaTokenComponent', () => {
  let component: ValidaTokenComponent;
  let fixture: ComponentFixture<ValidaTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidaTokenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidaTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
