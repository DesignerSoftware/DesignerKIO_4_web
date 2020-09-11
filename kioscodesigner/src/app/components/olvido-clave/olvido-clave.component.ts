import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-olvido-clave',
  templateUrl: './olvido-clave.component.html',
  styleUrls: ['./olvido-clave.component.css']
})
export class OlvidoClaveComponent implements OnInit {
formulario: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private loginService: LoginService,
              private usuarioService: UsuarioService) {
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

      swal.fire({
        title: 'Espera un momento... Estamos validando la información.',
        onBeforeOpen: () => {
          swal.showLoading();
          this.loginService.validarSeudonimoYNitEmpresaRegistrado(this.formulario.get('seudonimo').value,
          this.formulario.get('nitempresa').value)
          .subscribe(
            data => {
              if (data['result'] === 'true') {
                console.log(data);
                console.log('El usuario si existe');
                this.enviaClave();
              } else {
                swal.fire(
                  '¡Datos incorrectos!',
                  'No hemos encontrado información, verifique que su usuario y su empresa son correctos',
                  'error'
                );
              }
            },
            (error) => {
              console.log(error);
              swal.fire(
                '¡Error!',
                'Se presentó un error al validar la información. Por favor intentalo de nuevo más tarde.',
                'error'
              );
            }
          );
      },
        allowOutsideClick: () => !swal.isLoading()
      });
    }
  }

  enviaClave() {
    swal.fire({
      title: 'Espera un momento... Estamos generando tu nueva contraseña.',
      onBeforeOpen: () => {
        swal.showLoading();
        setTimeout(() => {
          this.usuarioService.generaClaveAleatoria(
            this.formulario.get('seudonimo').value, this.formulario.get('nitempresa').value
          )
          .subscribe(
            data => {
              if (data['envioCorreo']==true) {
                swal.fire({
                  icon: 'success',
                  title: '¡Revisa tu correo! Te hemos enviado tu nueva contraseña!',
                  showConfirmButton: true
                }).then((result) => {
                  if (result.value) {
                    this.redirigirInicio();
                  }
                });
              } else {
                swal.fire({
                  icon: 'error',
                  title: 'Hubo un error al generar tu nueva contraseña.',
                  text: '¡No fue posible generarte una nueva contraseña, por favor intentelo de nuevo más tarde.',
                  showConfirmButton: true
                }).then((result) => {
                  if (result.value) {
                    this.redirigirInicio();
                  }
                });
              }
            }
          );
        }, 1000);
      },
      allowOutsideClick: () => !swal.isLoading()
    });
  }

  redirigirInicio() {
    this.router.navigate(['/login']);
  }
}
