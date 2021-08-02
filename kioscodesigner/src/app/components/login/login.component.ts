import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';

import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  validaParametroGrupo = null;
  cadenasApp: any;
  formulario: FormGroup;
  empresas;
  grupoEmpresarial = null;
  urlKiosco = "https://www.designer:8179/#/login/GrupoEmpresarial1";

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public loginService: LoginService,
    public usuarioService: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cadenasKioskos: CadenaskioskosappService
  ) {
    console.log('constructor login');
    this.cadenasApp = null;
    console.log('usuario logueado', usuarioService.getUserLoggedIn());
    this.infoInicio();
  }

  ngOnInit() {

  }

  infoInicio() {
    if (!this.usuarioService.getUserLoggedIn()) {
      this.activatedRoute.params
        .subscribe(params => {
          if (params['grupo']) {
            this.grupoEmpresarial = params['grupo'];
            this.usuarioService.grupoEmpresarial = this.grupoEmpresarial;
            console.log('this.usuarioService.grupo', this.usuarioService.grupoEmpresarial);
            console.log(params);
            this.validaParametroGrupo = '';
            /*console.log(params.id);
        console.log(params[‘id’]);*/
            this.cadenasKioskos
              .getCadenasKioskosEmp(this.usuarioService.grupoEmpresarial)
              .subscribe((data) => {
                //console.log('cadenasKioskos form Registro', data);
                this.cadenasApp = data;
                console.log('cadenas: ', data)
                this.usuarioService.cadenaConexion = data[0][4];
                console.log('Cadena: ', this.usuarioService.cadenaConexion);
                console.log('length: '+this.cadenasApp.length);
                this.loginService.kioscoActivo = true;
                for (let i=0; i<this.cadenasApp.length; i++){
                  console.log(data[i][7]);
                  if (data[i][7]=='INACTIVO'){
                    console.log('desde login (usuario NO logueado) estado Kiosco: '+this.loginService.kioscoActivo);
                    this.loginService.kioscoActivo = false;
                    
                  }
                }
                if (this.cadenasApp.length === 1) {
                  this.formulario
                    .get('empresa')
                    // .setValue(this.cadenasApp[0].NITEMPRESA); // si solo hay una empresa se asigna el nit de ésta por defecto
                    .setValue(this.cadenasApp[0][2]); // si solo hay una empresa se asigna el nit de ésta por defecto
                } else {
                  // this.formulario.get('empresa').setValue('');
                }
              });
          } else {
            console.log('no hay parámetro');
            this.validaParametroGrupo = 'Importante: El link de acceso no es válido, por favor confirme con su empresa el enlace correcto.';
            $('#staticBackdrop').modal('show');
          }

        });


      this.crearFormulario();
      /*this.usuarioService.getEmpresas()
      .subscribe(
        data => {
          this.empresas = data;
          console.log(data);
        }
      );*/
    } else {
      // Validar que el Kiosco este activo  
      this.loginService.kioscoActivo = true;
      this.cadenasKioskos.getCadenasKioskosEmp(this.usuarioService.grupoEmpresarial)
      .subscribe(data=>{
        this.cadenasApp = data;
        for (let i=0; i<this.cadenasApp.length; i++){
          console.log(data[i][7]);
          if (data[i][7]=='INACTIVO'){
            this.loginService.kioscoActivo = false;
            this.loginService.mensajeKioscoInactivo = data[i][8];
            console.log('desde login (usuario logueado) estado Kiosco: '+this.loginService.kioscoActivo);
          }
        }
      });
      if (this.loginService.kioscoActivo) {
        this.navigate();
      }
    }
  }

  crearFormulario() {
    console.log('crearFormulario()');
    this.formulario = this.fb.group({
      usuario: ['', Validators.required],
      clave: ['', Validators.required],
      empresa: [, Validators.required]
    });
  }

  enviar() {
    this.urlKiosco = document.location.href;
    // console.log(this.formulario);
    Object.values(this.formulario.controls).forEach(control => {
      control.markAsTouched();
    });
    if (this.formulario.valid) {
      this.usuarioService.validarIngresoKioscoSeudonimo(this.formulario.get('usuario').value.trim().toLowerCase(),
        this.formulario.get('clave').value,
        this.formulario.get('empresa').value, this.usuarioService.cadenaConexion)
        .subscribe(
          data => {
            console.log(data);
            if (data['ingresoExitoso']) {
              console.log('ingresoExitoso: ' + data['ingresoExitoso']);
              this.loginService.generarToken(this.formulario.get('usuario').value.toLowerCase(),
                this.formulario.get('clave').value, this.formulario.get('empresa').value, this.usuarioService.cadenaConexion, this.usuarioService.grupoEmpresarial)
                .subscribe(
                  res => {
                    console.log('Respuesta token generado: ', res);
                    let jwt: any = JSON.parse(JSON.stringify(res));
                    //console.log('JWT Generado: ' + jwt['JWT']);
                    if (!res) {
                      swal.fire('Objeto Vacio!!!', ' :(', 'success');
                    } else {
                      let timerInterval;
                      swal.fire({
                        title: 'Bienvenido...',
                        html: 'Espere un momento mientras lo redireccionamos a la página de inicio',
                        backdrop: 'RGB(3,58,100)',
                        timer: 2000,
                        timerProgressBar: true,
                        onBeforeOpen: () => {
                          swal.showLoading();
                          timerInterval = setInterval(() => {
                            /*swal.getContent().querySelector('b')
                              .textContent = swal.getTimerLeft()*/
                          }, 100);
                        },
                        onClose: () => {
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
                            //(opcKio) => opcKio['NITEMPRESA'] === this.formulario.get('empresa').value
                            (opcKio) => opcKio[2] === this.formulario.get('empresa').value
                          );
                          console.log('empresa seleccionada', cadenaEmpresa);
                          const sesion: any = {
                            usuario: this.formulario.get('usuario').value.toLowerCase(),
                            JWT: jwt['JWT'],
                            empresa: this.formulario.get('empresa').value,
                            grupo: this.grupoEmpresarial,
                            // cadena: cadenaEmpresa['CADENA']
                            cadena: cadenaEmpresa[4],
                            urlKiosco: document.location.href
                          };
                          //console.log('cadena: ', cadenaEmpresa[4]);
                          this.usuarioService.setUserLoggedIn(sesion);
                          this.usuarioService.getUserLoggedIn(); // Mostrar por consola los datos del usuario actual

                        }
                      });
                    }
                  },
                  error => {
                    console.log('Error: ' + JSON.stringify(error.statusText));
                    swal.fire({
                      icon: 'error',
                      title: '¡Se ha presentado un error!',
                      text: 'Error de conexión. Por favor intentélo de nuevo más tarde. Error: cod ' +
                        error.status + ' :' + error.statusText
                    });
                  },
                  () => this.navigate()
                );
            } else if (data['EstadoUsuario'] == 'P') {
              swal.fire({
                icon: 'error',
                title: '¡Cuenta no validada!',
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
            } else {
              swal.fire({
                icon: 'error',
                // title: '¡Usuario o contraseña incorrectos!',
                /*'¡Usuario o contraseña incorrectos!',*/
                title: `${data['mensaje']}`
                /*'error'*/
              });
            }

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
    console.log('enviarCorreoConfirmación');
    swal.fire({
      title: 'Espera un momento.. Estamos enviándote el correo de confirmación',
      onBeforeOpen: () => {
        swal.showLoading();
        this.usuarioService.inactivaTokensTipo('VALIDACUENTA', this.formulario.get('usuario').value, this.formulario.get('empresa').value, this.usuarioService.cadenaConexion)
          .subscribe(
            data => {
              // console.log(data);
              this.loginService.enviarCorreoConfirmaCuenta(
                this.formulario.get('usuario').value,
                this.formulario.get('clave').value,
                //this.formulario.get('empresa').value, 'www.nominadesigner.co')
                this.formulario.get('empresa').value, this.usuarioService.cadenaConexion, this.usuarioService.grupoEmpresarial, this.urlKiosco
              )
                .subscribe(
                  data2 => {
                    if (data2['envioCorreo'] === true) {
                      console.log('Por favor verifica tu cuenta de correo');
                      swal.fire({
                        icon: 'success',
                        title: '¡Revisa tu correo!',
                        text: 'Se te ha enviado un nuevo correo ' +
                          ' para que valides tu cuenta. Recuerda que tienes una hora para validarla, de lo contrario ' +
                          'deberas solicitar la generación de un nuevo correo.',
                        showConfirmButton: true
                      }).then((result) => {
                        if (result.value) {
                          // document.location.href = './login';
                          //this.router.navigate(['/login']);
                          //this.router.navigate(['/']);
                          if (this.usuarioService.grupoEmpresarial != null) {
                            this.router.navigate(['/login', this.usuarioService.grupoEmpresarial]);
                            //this.router.navigate(['/']);
                          } else {
                            this.router.navigate(['/login']);
                          }
                        }
                      });
                    } else {
                      swal.fire({
                        icon: 'error',
                        title: 'Se ha presentado un error al enviarte el correo de confirmación.',
                        text: '¡No fue posible enviarte el correo para confirmar tu cuenta, por favor intenta iniciar sesión ' +
                          'y haz clic en la opción para enviarte nuevamente el correo.',
                        showConfirmButton: true
                      }).then((result) => {
                        if (result.value) {
                          // document.location.href = './login';
                          //this.navigate(); 210603
                          if (this.usuarioService.grupoEmpresarial != null) {
                            this.router.navigate(['/login', this.usuarioService.grupoEmpresarial]);
                            //this.router.navigate(['/']);
                          } else {
                            this.router.navigate(['/login']);
                          }
                        }
                      });
                    }
                  },
                  (error) => {
                    swal.fire({
                      icon: 'error',
                      title: 'Se ha presentado un error al enviarte el correo de confirmación.',
                      text: '¡No fue posible enviarte el correo para confirmar tu cuenta, por favor intenta iniciar sesión y haz clic en la opción ' +
                        'para enviarte nuevamente el correo.',
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
    /*if (this.formulario.get('empresa').value) {
      console.log('presiono botón');*/
    $('#staticBackdrop').modal('show');
    /*} else {
      swal.fire({
        icon: 'error',
        title: 'Por favor seleccione una empresa',
        text: 'Seleccione la empresa a la que pertenece para indicarle con quien puede contactarse.',
        showConfirmButton: true
      });
    }*/

  }

}
