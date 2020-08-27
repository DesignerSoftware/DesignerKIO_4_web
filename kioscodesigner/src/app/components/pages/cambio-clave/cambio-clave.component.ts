import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidadoresService } from '../../../services/validadores.service';

@Component({
  selector: 'app-cambio-clave',
  templateUrl: './cambio-clave.component.html',
  styleUrls: ['./cambio-clave.component.css']
})
export class CambioClaveComponent implements OnInit {
  formulario: FormGroup;

  constructor(private fb: FormBuilder, private validadores: ValidadoresService) {
    this.crearFormulario();
  }

  ngOnInit() {
  }

  crearFormulario() {
    this.formulario = this.fb.group({
      passActual: ['', Validators.required],
      pass1: ['', [Validators.required, Validators.pattern('((?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%\*\.\-_\+~\/;,\(\)!]).{8,})')]],
      pass2: ['', Validators.required]
    },
    {
      validators: this.validadores.passwordIguales('pass1', 'pass2')
    });
  }

  enviar() {
    Object.values( this.formulario.controls ).forEach( control => {
      control.markAsTouched();
    });
  }

}
