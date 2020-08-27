import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-olvido-clave',
  templateUrl: './olvido-clave.component.html',
  styleUrls: ['./olvido-clave.component.css']
})
export class OlvidoClaveComponent implements OnInit {
formulario: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private loginService: LoginService) {
    this.crearFormulario();
  }

  ngOnInit() {
  }

  crearFormulario() {
    this.formulario = this.fb.group({
      seudonimo: [, Validators.required],
      nitempresa: ['', [Validators.required, Validators.pattern("^([0-9])*$")] ]
    });
  }

  enviar() {
    Object.values( this.formulario.controls ).forEach( control => {
      control.markAsTouched();
    });
    if (this.formulario.valid) {
       this.loginService.validarSeudonimoYNitEmpresaRegistrado(this.formulario.get('seudonimo').value, 
       this.formulario.get('nitempresa').value)
      .subscribe(
        data => {
          if (data['result'] === 'true') {
            console.log(data);
            console.log('El usuario si existe');
          } else {
            swal.fire(
              'Error!',
              'No hemos encontrado el usuario, verifique que digitó correctamente su usuario y el nit de la empresa.!',
              'error'
            );
          }
        }
      )
    }
  }

  redirigirInicio() {
    this.router.navigate(['/login']);
  }
}
