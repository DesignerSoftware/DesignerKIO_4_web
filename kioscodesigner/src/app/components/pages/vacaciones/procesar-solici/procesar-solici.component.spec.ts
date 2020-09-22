import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesarSoliciComponent } from './procesar-solici.component';

describe('ProcesarSoliciComponent', () => {
  let component: ProcesarSoliciComponent;
  let fixture: ComponentFixture<ProcesarSoliciComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcesarSoliciComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesarSoliciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
