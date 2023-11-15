import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesarSoliciComponent } from './procesar-solici.component';

describe('ProcesarSoliciComponent', () => {
  let component: ProcesarSoliciComponent;
  let fixture: ComponentFixture<ProcesarSoliciComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcesarSoliciComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcesarSoliciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
