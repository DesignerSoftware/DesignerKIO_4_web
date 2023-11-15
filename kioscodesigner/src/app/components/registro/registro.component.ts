import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ValidadoresService } from 'src/app/services/validadores.service';
import { environment } from 'src/environments/environment';
import swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  validaParametroGrupo: string = '';
  cadenasApp: any;
  grupoEmpresarial: string = '';
  formulario: FormGroup = {} as FormGroup;
  habilitaCamposClave = false;
  empresas: any;
  urlKiosco: any;

  constructor(private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private usuarioServicio: UsuarioService,
    private validadores: ValidadoresService,
    private activatedRoute: ActivatedRoute,
    private cadenasKioskos: CadenaskioskosappService) {
    this.crearFormulario();
    this.activatedRoute.params
      .subscribe(params => {
        if (params['grupo']) {
          this.grupoEmpresarial = params['grupo'];
          this.usuarioServicio.grupoEmpresarial = this.grupoEmpresarial;
          console.log(params);

          this.cadenasKioskos.getCadenasKioskosEmp(params['grupo'], environment.urlKiosko)
            .subscribe(
              (data: any) => {
                console.log('cadenasKioskos ', data);
                this.usuarioServicio.cadenaConexion = data[0][4];
                this.cadenasApp = data;

                if (this.cadenasApp.length === 1) {
                  this.formulario.get('empresa')!.setValue(this.cadenasApp[0][2]); // si solo hay una empresa se asigna el nit de ésta por defecto
                } else {
                }
              }
            )
        } else {
          console.log('no hay parámetro');
          this.validaParametroGrupo = 'Importante: El link de acceso no es válido, por favor confirme con su empresa el enlace correcto.';
        }

      });
  }

  ngOnInit() {
  }

  crearFormulario() {
    this.formulario = this.fb.group({
      documento: ['', [Validators.required, Validators.pattern("^([0-9])*$")]],
      correo: ['', Validators.required],
      nitempresa: [,],
      seudonimo: [, Validators.required],
      pass1: [, [Validators.required,
      Validators.pattern("^((?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[%\\*\\.\\-_\\+~\\;,\\(\\)!]).{8,})$")
      ]
      ],
      pass2: [, [Validators.required]]
    },
      {
        validators: this.validadores.passwordIguales('pass1', 'pass2')
      });
  }

  validarUsuario() { // validar si existe
    console.log(this.formulario);
    Object.values(this.formulario.controls).forEach(control => {
      control.markAsTouched();
    });
    if (this.formulario.get('documento')!.valid
      && this.formulario.get('nitempresa')!.valid) {
      this.loginService.validarUsuarioYEmpresa(this.formulario.get('documento')!.value,
        this.formulario.get('nitempresa')!.value, this.usuarioServicio.cadenaConexion)
        .subscribe(
          (data: any) => {
            if (data['result'] === 'true') {
              console.log('usuario valido');
              this.validarUsuarioRegistrado();
            } else {
              swal.fire({
                icon: 'error',
                title: 'El documento no es correcto o no pertenece a la empresa seleccionada',
                showConfirmButton: true
              });
            }
          }
        );
    } else {
    }
  }

  validarUsuarioRegistrado() {
    this.usuarioServicio.validaUsuarioYNitEmpresaRegistrado(
      this.formulario.get('documento')!.value,
      this.formulario.get('nitempresa')!.value,
      this.usuarioServicio.cadenaConexion
    )
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data['result'] === 'false') {
            this.habilitaCamposClave = true;
            this.formulario.get('documento')!.disable();
            this.formulario.get('nitempresa')!.disable();
            this.consultarCorreo();
            this.formulario.get('pass1')!.markAsUntouched();
            this.formulario.get('pass2')!.markAsUntouched();
            this.formulario.get('seudonimo')!.markAsUntouched();
          } else {
            swal.fire({
              icon: 'error',
              title: 'Ya existe un usuario relacionado a la empresa seleccionada.',
              showConfirmButton: true
            }).then((result) => {
              console.log('redireccionando a login');
              if (this.usuarioServicio.grupoEmpresarial != null) {
                this.router.navigate(['/login', this.usuarioServicio.grupoEmpresarial]);
              } else {
                this.router.navigate(['/login']);
              }
            });
          }
        }
      );
  }

  consultarCorreo() {
    this.loginService.getCorreoAsociadoPersonaEmpresa(this.formulario.get('documento')!.value,
      this.formulario.get('nitempresa')!.value, this.usuarioServicio.cadenaConexion)
      .subscribe(
        (data: any) => {
          if (data['result']
            && (data['result'] != null
              || data['result'] !== '')) {
            this.formulario.get('correo')!.setValue(data['result']);
            document.getElementById('divCorreo')!.style.display = '';
            console.log(data['result']);
          } else {
            this.habilitaCamposClave = false;
            swal.fire({
              icon: 'error',
              title: 'No existe un correo relacionado.',
              text: 'Por favor verifique su correo asociado con el área de recursos humanos y/o nómina para poder crear su usuario de Kiosco',
              showConfirmButton: true
            }).then((result) => {
              if (this.usuarioServicio.grupoEmpresarial != null) {
                this.router.navigate(['/login', this.usuarioServicio.grupoEmpresarial]);
              } else {
                this.router.navigate(['/login']);
              }
            });
          }
        }
      );
  }

  crearUsuario() {
    Object.values(this.formulario.controls).forEach(control => {
      control.markAsTouched();
    });

    if (this.formulario.valid) {
      this.habilitaCamposClave = false;
      document.getElementById('loader')!.style.display = '';
      document.getElementById('mensaje')!.innerHTML = 'Estamos validando la información';
      let seudonimoCuenta: any;
      if (this.formulario.get('seudonimo')!.value === 'correo') {
        seudonimoCuenta = this.formulario.get('correo')!.value;
      } else {
        seudonimoCuenta = this.formulario.get('documento')!.value;
      }
      this.loginService.registrarUsuario(seudonimoCuenta, this.formulario.get('documento')!.value,
        this.formulario.get('pass1')!.value, this.formulario.get('nitempresa')!.value,
        this.formulario.get('correo')!.value, this.usuarioServicio.cadenaConexion)
        .subscribe(
          (info: any) => {
            console.log('crear usuario', info);
            if (info['created'] === true) {
              swal.fire({
                icon: 'success',
                title: '¡Felicitaciones!',
                text: 'Los datos de tu cuenta han sido guardados exitosamente',
                showConfirmButton: true
              }).then((result) => {
                if (result.value) {
                  this.enviarCorreoConfirmaCuenta(seudonimoCuenta);
                }
              });
            } else {
              swal.fire({
                icon: 'error',
                title: '¡No fue posible crear su usuario!',
                text: info['Mensaje'],
                showConfirmButton: true
              }).then((result) => {
                if (result.value) {
                  if (this.usuarioServicio.grupoEmpresarial != null) {
                    this.router.navigate(['/login', this.usuarioServicio.grupoEmpresarial]);
                  } else {
                    this.router.navigate(['/login']);
                  }
                }
              });
            }
          },
          error => {
            console.log('error', error);
          }
        );
    } else {
    }
    console.log('recibido', this.formulario);
  }

  enviarCorreoConfirmaCuenta(seudonimo: string) {
    //this.urlKiosco = document.location.href;
    this.urlKiosco = environment.urlKiosko;
    console.log('enviarCorreoConfirmación');
    console.log('urlKiosco: '+this.urlKiosco);
    swal.fire({
      title: 'Espera un momento.. Estamos enviándote el correo de confirmación',
      willOpen: () => {
        swal.showLoading();
        this.loginService.enviarCorreoConfirmaCuenta(
          seudonimo,
          this.formulario.get('pass1')!.value,
          this.formulario.get('nitempresa')!.value, this.usuarioServicio.cadenaConexion, this.usuarioServicio.grupoEmpresarial, this.urlKiosco)
          .subscribe(
            data => {
              if (data['envioCorreo'] === true) {
                console.log('Por favor verifica tu cuenta de correo');
                swal.fire({
                  icon: 'success',
                  title: '¡Revisa tu correo!',
                  text: 'Se te ha enviado un correo a '
                    + this.formulario.get('correo')!.value
                    + ' para que valides tu cuenta. Recuerda que tienes una hora para validarla, de lo contrario '
                    + 'deberas solicitar la generación de un nuevo correo.',
                  showConfirmButton: true
                }).then((result) => {
                  if (result.value) {
                    this.redirigirInicio();
                  }
                });
              } else {
                swal.fire({
                  icon: 'error',
                  title: 'Se ha presentado un error al enviarte el correo de confirmación.',
                  text: '¡No fue posible enviarte el correo para confirmar tu cuenta, por favor intenta iniciar sesión '
                    + 'y haz clic en la opción para enviarte nuevamente el correo.',
                  showConfirmButton: true
                }).then((result) => {
                  if (result.value) {
                    this.redirigirInicio();
                  }
                });
              }
            },
            (error) => {
              swal.fire({
                icon: 'error',
                title: 'Se ha presentado un error al enviarte el correo de confirmación.',
                text: '¡No fue posible enviarte el correo para confirmar tu cuenta, por favor intenta iniciar sesión y haz clic en la opción '
                  + 'para enviarte nuevamente el correo.',
                showConfirmButton: true
              }).then(
                (result) => {
                  if (result.value) {
                    this.redirigirInicio();
                  }
                });
            }
          );
      },
      allowOutsideClick: () => !swal.isLoading()
    });
  }


  redirigirInicio() {
    if (this.grupoEmpresarial != null) {
      this.router.navigate(['/login', this.grupoEmpresarial]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
