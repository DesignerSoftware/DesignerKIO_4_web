import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-olvido-clave',
  templateUrl: './olvido-clave.component.html',
  styleUrls: ['./olvido-clave.component.scss']
})
export class OlvidoClaveComponent implements OnInit {

  formulario: FormGroup = {} as FormGroup;
  empresas: any;
  grupoEmpresarial: string = '';
  cadenasApp: any;
  validaParametroGrupo = '';
  urlKiosco = "https://www.designer.com.co:8179/#/login/GrupoEmpresarial1";

  constructor(private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private usuarioService: UsuarioService,
    private activatedRoute: ActivatedRoute,
    private cadenasKioskos: CadenaskioskosappService
  ) {
    this.activatedRoute.params
      .subscribe(params => {
        // crear formulario
        this.crearFormulario();
        if (params['grupo']) {
          this.grupoEmpresarial = params['grupo'];
          this.usuarioService.grupoEmpresarial = this.grupoEmpresarial;
          this.urlKiosco = document.location.href;
          this.cadenasKioskos
            .getCadenasKioskosEmp(params['grupo'], this.urlKiosco)
            .subscribe((data: any) => {
              this.cadenasApp = data;
              this.usuarioService.cadenaConexion = data[0][4];
              if (this.cadenasApp.length === 1) {
                // si solo hay una empresa se asigna el nit de ésta por defecto
                this.formulario.get('empresa')!
                  .setValue(this.cadenasApp[0].NITEMPRESA);
              } else {
              }
            });
        } else {
          // si no existe el parámetro
          this.validaParametroGrupo = 'Importante: El link de acceso no es válido, por favor confirme con su empresa el enlace correcto.';
        }
      });
  }

  ngOnInit() {
  }

  crearFormulario() {
    this.formulario = this.fb.group({
      seudonimo: [, Validators.required],
      nitempresa: ['', [Validators.required]]
    });
  }

  enviar() {
    Object.values(this.formulario.controls).forEach(control => {
      control.markAsTouched();
    });
    if (this.formulario.valid) {
      swal.fire({
        title: 'Espere un momento... Estamos validando la información.',
        willOpen: () => {
          swal.showLoading();
          this.loginService.validarSeudonimoYNitEmpresaRegistrado(this.formulario.get('seudonimo')!.value,
            this.formulario.get('nitempresa')!.value, this.usuarioService.cadenaConexion)
            .subscribe(
              (data: any) => {
                if (data['result'] === 'true') {
                  this.enviaClave();
                } else {
                  swal.fire(
                    '¡Datos incorrectos!',
                    'No hemos encontrado información, verifique que su usuario y su empresa son correctos',
                    'error'
                  );
                }
              },
              (error: any) => {
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
      willOpen: () => {
        swal.showLoading();
        setTimeout(() => {
          this.usuarioService.generaClaveAleatoria(
            this.formulario.get('seudonimo')!.value, this.formulario.get('nitempresa')!.value, this.usuarioService.cadenaConexion
          )
            .subscribe(
              (data: any) => {
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
                } else if (data['envioCorreo'] === false && data['correo'] === null) {
                  swal.fire({
                    icon: 'error',
                    title: 'Hubo un error al enviar el correo.',
                    text: '¡No fue posible enviar el correo debido a que su cuenta no tiene un email asignado.',
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
    if (this.grupoEmpresarial != null) {
      this.router.navigate(['/login', this.grupoEmpresarial]);
    } else {
      this.router.navigate(['/login']);
    }

  }
}
