import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidadoresService {

  constructor() {

  }

  passwordIguales(pass1Name: string, pass2Name: string) {
    return (formGroup: FormGroup) => {  // recibe el formulario

      /*Referencias a los controles que tienen los valores a evaluar:*/
      const pass1Control = formGroup.controls[pass1Name];
      const pass2Control = formGroup.controls[pass2Name];

      if (pass1Control.value === pass2Control.value) {
        if (pass2Control.getError('required')) {
        } else {
          pass2Control.setErrors(null);
        }
      } else {
        pass2Control.setErrors({noEsIgual: true});
      }
    };
  }
}
