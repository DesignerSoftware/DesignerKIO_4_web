import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-olvido-clave',
  templateUrl: './olvido-clave.component.html',
  styleUrls: ['./olvido-clave.component.css']
})
export class OlvidoClaveComponent implements OnInit {
formulario: FormGroup;
empresas;
grupoEmpresarial = null;
cadenasApp;
validaParametroGrupo = '';

  constructor(private fb: FormBuilder, private router: Router, private loginService: LoginService,
              private usuarioService: UsuarioService, private activatedRoute: ActivatedRoute,
              private cadenasKioskos: CadenaskioskosappService
              ) {
    this.activatedRoute.params
    .subscribe(params => {
      this.crearFormulario(); // crear formulario
      if (params['grupo']) {
        this.grupoEmpresarial = params['grupo'];
        console.log(params);

        this.cadenasKioskos
        .getCadenasKioskosEmp(params['grupo'])
        .subscribe((data) => {
          console.log(data);
          this.cadenasApp = data;

          if (this.cadenasApp.length === 1) {
            this.formulario
              .get('empresa')
              .setValue(this.cadenasApp[0].NITEMPRESA); // si solo hay una empresa se asigna el nit de ésta por defecto
          } else {
            // this.formulario.get('empresa').setValue('');
          }
        });
      } else {
        // si no existe el parámetro
        console.log('no hay parámetro');
        this.validaParametroGrupo = 'Importante: El link de acceso no es válido, por favor confirme con su empresa el enlace correcto.';
      }
    });
  }

  ngOnInit() {
  }

  crearFormulario() {
    this.formulario = this.fb.group({
      seudonimo: [, Validators.required],
      nitempresa: ['', [Validators.required/*, Validators.pattern("^([0-9])*$")*/] ]
    });
    this.usuarioService.getEmpresas()
    .subscribe(
      data => {
        this.empresas = data;
      }
    )
  }

  enviar() {
    Object.values( this.formulario.controls ).forEach( control => {
      control.markAsTouched();
    });
    if (this.formulario.valid) {

      swal.fire({
        title: 'Espere un momento... Estamos validando la información.',
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
              if (data['envioCorreo'] === true) {
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
    if (this.grupoEmpresarial!=null) {
       this.router.navigate(['/login', this.grupoEmpresarial]);
    } else {
      this.router.navigate(['/login']);
    }
    
  }
}
