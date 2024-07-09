import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import swal from 'sweetalert2';
import * as bootstrap from "bootstrap";
import * as $ from 'jquery';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  validaParametroGrupo: string = '';
  cadenasApp: any;
  formulario: FormGroup = {} as FormGroup;
  empresas: any = null;
  grupoEmpresarial: string = '';
  urlKiosco: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public loginService: LoginService,
    public usuarioService: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cadenasKioskos: CadenaskioskosappService
  ) {
    this.cadenasApp = null;
    this.infoInicio();
  }

  ngOnInit(): void {

  }

  infoInicio() {
    if (!this.usuarioService.getUserLoggedIn()) {
      this.activatedRoute.params
        .subscribe(params => {
          if (params['grupo']) {
            this.grupoEmpresarial = params['grupo'];
            this.usuarioService.grupoEmpresarial = this.grupoEmpresarial;
            this.validaParametroGrupo = '';
            this.urlKiosco = document.location.href;
            this.cadenasKioskos.
              getCadenasKioskosEmp(this.usuarioService.grupoEmpresarial, this.urlKiosco)
              .subscribe((data) => {
                this.cadenasApp = data;
                console.log('cadenas: ', data)
                if (Array.isArray(data)) {
                  this.usuarioService.cadenaConexion = data[0][4];
                }
                this.loginService.kioscoActivo = true;
                for (let i = 0; i < this.cadenasApp.length; i++) {
                  if (Array.isArray(data)) {
                    if (data[i][7] == 'INACTIVO') {
                      this.loginService.mensajeKioscoInactivo = data[i][8];
                      this.loginService.kioscoActivo = false;
                    }
                  }
                }
                if (this.cadenasApp.length === 1) {
                  // si solo hay una empresa se asigna el nit de ésta por defecto
                  this.formulario.get('empresa')!.setValue(this.cadenasApp[0][2]);
                } else {
                }
              });
          } else {
            this.validaParametroGrupo = 'Importante: El link de acceso no es válido, por favor confirme con su empresa el enlace correcto.';
            $('#staticBackdrop').modal('show');
          }
        });
      this.crearFormulario();
    } else {
      // Validar que el Kiosco esté activo  
      this.loginService.kioscoActivo = true;
      this.cadenasKioskos.getCadenaKioskoXGrupoNit(this.usuarioService.grupoEmpresarial, this.usuarioService.empresa)
        .subscribe(data => {
          this.cadenasApp = data;
          for (let i = 0; i < this.cadenasApp.length; i++) {
            if (Array.isArray(data)) {
              if (data[i][7] == 'INACTIVO') {
                this.loginService.kioscoActivo = false;
                this.loginService.mensajeKioscoInactivo = data[i][8];
              }
            }
          }
        });
      if (this.loginService.kioscoActivo) {
        this.navigate();
      }
    }
  }

  crearFormulario() {
    this.formulario = this.fb.group({
      usuario: ['', Validators.required],
      clave: ['', Validators.required],
      empresa: [, Validators.required]
    });
  }

  urlKiosko() {
    let urltemp = this.usuarioService.getUrl();
    return urltemp
  }

  enviar() {
    this.urlKiosco = document.location.href;
    Object.values(this.formulario.controls).forEach(control => {
      control.markAsTouched();
    });
    if (this.formulario.valid) {
      this.usuarioService.validarIngresoKioscoSeudonimo(
        this.formulario.get('usuario')!.value!.trim().toLowerCase(),
        this.formulario.get('clave')!.value!,
        this.formulario.get('empresa')!.value!,
        this.usuarioService.cadenaConexion)
        .subscribe(
          data => {
            let correoTemp: string = data['Correo'];
            if (data['ingresoExitoso']) {
              this.loginService.generarToken(
                this.formulario.get('usuario')!.value!.toLowerCase(),
                this.formulario.get('clave')!.value!,
                this.formulario.get('empresa')!.value!,
                this.usuarioService.cadenaConexion,
                this.usuarioService.grupoEmpresarial)
                .subscribe(
                  res => {
                    let jwt: any = JSON.parse(JSON.stringify(res));
                    if (!res) {
                      swal.fire('Objeto Vacio!!!', ' :(', 'success');
                    } else {
                      let timerInterval: any;
                      swal.fire({
                        title: 'Bienvenido...',
                        html: 'Espere un momento mientras lo redireccionamos a la página de inicio',
                        timer: 2000,
                        timerProgressBar: true,
                        didOpen: () => {
                          swal.showLoading();
                          timerInterval = setInterval(() => {
                          }, 100)
                        },
                        willClose: () => {
                          clearInterval(timerInterval);
                        }
                      }).then((result) => {
                        if (
                          /* Read more about handling dismissals below */
                          result.dismiss === swal.DismissReason.timer
                        ) {
                          // al cerrarse la ventana modal:
                          this.navigate();
                          // sesion guardará el arreglo que se guardará en el localStorage
                          const cadenaEmpresa = this.cadenasApp.filter( // consultar empresa seleccionada
                            (opcKio: any) => opcKio[2] === this.formulario.get('empresa')!.value
                          );
                          const sesion: any = {
                            usuario: this.formulario.get('usuario')!.value!.toLowerCase().trim(),
                            JWT: jwt['JWT'],
                            empresa: this.formulario.get('empresa')!.value,
                            grupo: this.grupoEmpresarial,
                            cadena: cadenaEmpresa[4],
                            urlKiosco: document.location.href
                          };
                          this.usuarioService.setUserLoggedIn(sesion);
                          // Mostrar por consola los datos del usuario actual
                          this.usuarioService.getUserLoggedIn();

                        }
                      });
                    }
                  },
                  error => {
                    swal.fire({
                      icon: 'error',
                      title: '¡Se ha presentado un error!',
                      text: 'Error de conexión. Por favor intentélo de nuevo más tarde. Error: cod '
                        + error.status
                        + ' :'
                        + error.statusText
                    });
                  },
                  () => this.navigate()
                );
            } else if (data['EstadoUsuario'] == 'P' && data['primerIngreso']) {
              swal.fire({
                icon: 'error',
                title: '¡Cambio de correo!',
                /*'¡Usuario o contraseña incorrectos!',*/
                text: `${data['mensaje']}`,
                showCancelButton: true,
                cancelButtonText: 'Ok',
                confirmButtonText: `Reenviar`
              }).then((result) => {
                if (result.isConfirmed) {
                  this.enviarCorreoConfirmaCuenta(this.usuarioService.usuario);
                }
              });
            } else if (data['EstadoUsuario'] == 'P' && data['ValidaEmail']) {
              swal.fire({
                icon: 'error',
                title: '¡Valida correo nuevo!',
                /*'¡Usuario o contraseña incorrectos!',*/
                text: `${data['mensaje']}`,
                showCancelButton: true,
                cancelButtonText: 'Ok',
                confirmButtonText: `Reenviar`
              }).then((result) => {
                if (result.isConfirmed) {
                  this.enviarCorreoConfirmaCuenta(correoTemp);
                }
              });
            } else {
              swal.fire({
                icon: 'error',
                title: `${data['mensaje']}`
              });
            }
            //}
          },
          error => {
            swal.fire(
              '¡Se ha presentado un error de conexión!',
              'Por favor inténtelo de nuevo más tarde.',
              'error'
            );
          }
        );

    }
  }

  enviarCorreoConfirmaCuenta(seudonimo: string) {
    let empresa = this.formulario.get('empresa')!.value;
    console.log('Empresa: '+empresa);
    swal.fire({
      title: 'Espera un momento.. Estamos enviándote el correo de confirmación',
      didOpen: () => {
        swal.showLoading();
        //this.usuarioService.inactivaTokensTipo('VALIDACUENTA', seudonimo, this.formulario.get('empresa')!.value!, this.usuarioService.cadenaConexion)
        this.usuarioService.inactivaTokensTipo('VALIDACUENTA', seudonimo, empresa, this.usuarioService.cadenaConexion)
          .subscribe(
            data => {
              this.loginService.enviarCorreoConfirmaCuenta(
                seudonimo,
                this.formulario.get('clave')!.value!,
                //this.formulario.get('empresa')!.value!, this.usuarioService.cadenaConexion, this.usuarioService.grupoEmpresarial, this.urlKiosco
                empresa, this.usuarioService.cadenaConexion, this.usuarioService.grupoEmpresarial, this.urlKiosco
              ).subscribe(
                data2 => {
                  if (data2['envioCorreo'] === true) {
                    swal.fire({
                      icon: 'success',
                      title: '¡Revisa tu correo!',
                      text: 'Se te ha enviado un nuevo correo ' 
                      + ' para que valides tu cuenta. Recuerda que tienes una hora para validarla, de lo contrario ' 
                      + 'deberas solicitar la generación de un nuevo correo.',
                      showConfirmButton: true
                    }).then((result: any) => {
                      if (result.value) {
                        if (this.usuarioService.grupoEmpresarial != null) {
                          this.router.navigate(['/login', this.usuarioService.grupoEmpresarial]);
                        } else {
                          this.router.navigate(['/login']);
                        }
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
                        if (this.usuarioService.grupoEmpresarial != null) {
                          this.router.navigate(['/login', this.usuarioService.grupoEmpresarial]);
                        } else {
                          this.router.navigate(['/login']);
                        }
                      }
                    });
                  }
                },
                (error: any) => {
                  swal.fire({
                    icon: 'error',
                    title: 'Se ha presentado un error al enviarte el correo de confirmación.',
                    text: '¡No fue posible enviarte el correo para confirmar tu cuenta, por favor intenta iniciar sesión y haz clic en la opción ' 
                    + 'para enviarte nuevamente el correo.',
                    showConfirmButton: true
                  });
                }
              );
            }
          )
      },
      allowOutsideClick: () => !swal.isLoading()
    });
  }


  navigate() {
    this.router.navigate(['/home']);
  }

  mostrarModalContacto() {
    $('#staticBackdrop').modal('show');
  }
}
