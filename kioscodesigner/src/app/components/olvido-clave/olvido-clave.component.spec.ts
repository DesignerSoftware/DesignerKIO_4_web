import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlvidoClaveComponent } from './olvido-clave.component';

describe('OlvidoClaveComponent', () => {
  let component: OlvidoClaveComponent;
  let fixture: ComponentFixture<OlvidoClaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlvidoClaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlvidoClaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
