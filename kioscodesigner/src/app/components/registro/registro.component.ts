import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ValidadoresService } from 'src/app/services/validadores.service';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  validaParametroGrupo=null;
  cadenasApp: any;
  grupoEmpresarial= null;
  formulario: FormGroup;
  habilitaCamposClave = false;
  empresas;

  constructor(private fb: FormBuilder, private router: Router, private loginService: LoginService,
              private usuarioServicio: UsuarioService, private validadores: ValidadoresService,
              private activatedRoute: ActivatedRoute,
              private cadenasKioskos: CadenaskioskosappService) {
    this.crearFormulario();
      this.activatedRoute.params
      .subscribe(params => {
        if (params['grupo']) {
        this.grupoEmpresarial = params['grupo'];
        this.usuarioServicio.grupoEmpresarial = this.grupoEmpresarial;
      console.log(params);

    	/*console.log(params.id);
    	console.log(params[‘id’]);*/
      this.cadenasKioskos.getCadenasKioskosEmp(params['grupo'])
      .subscribe(
        data => {
        console.log('cadenasKioskos ',data);
        this.usuarioServicio.cadenaConexion = data[0][4];
        this.cadenasApp = data;

    if (this.cadenasApp.length===1){
      this.formulario.get('empresa').setValue(this.cadenasApp[0][2]); // si solo hay una empresa se asigna el nit de ésta por defecto
    } else {
      //this.formulario.get('empresa').setValue('');
    }
        }
      )
        } else {
          console.log('no hay parámetro');
          this.validaParametroGrupo='Importante: El link de acceso no es válido, por favor confirme con su empresa el enlace correcto.';
        }

    });
    /*this.usuarioServicio.getEmpresas()
    .subscribe(
      data => {
        this.empresas = data;
      }
    );*/
  }

  ngOnInit() {
  }

  crearFormulario() {
    this.formulario = this.fb.group({
      documento: ['', [Validators.required, Validators.pattern("^([0-9])*$")]],
      correo: ['', Validators.required],
      nitempresa: ['', [Validators.required, Validators.pattern("^([0-9])*$")] ],
      seudonimo: [, Validators.required],
      pass1: [, [Validators.required,
                 Validators.pattern("^((?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%\\*\\.\\-_\\+~\\/;,\\(\\)!\\&]).{8,})$")
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
    if (this.formulario.get('documento').valid && this.formulario.get('nitempresa').valid) {
      this.loginService.validarUsuarioYEmpresa(this.formulario.get('documento').value, this.formulario.get('nitempresa').value, this.usuarioServicio.cadenaConexion)
        .subscribe(
          data => {
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
      return false;
    }
  }

  validarUsuarioRegistrado() {
     this.usuarioServicio.validaUsuarioYNitEmpresaRegistrado(
      this.formulario.get('documento').value,
      this.formulario.get('nitempresa').value,
      this.usuarioServicio.cadenaConexion
     )
     .subscribe(
       data => {
         console.log(data);
         if (data['result'] === 'false') {
          this.habilitaCamposClave = true;
          this.formulario.get('documento').disable();
          this.formulario.get('nitempresa').disable();
          this.consultarCorreo();
          this.formulario.get('pass1').markAsUntouched();
          this.formulario.get('pass2').markAsUntouched();
          this.formulario.get('seudonimo').markAsUntouched();
          // document.getElementById("documento").disabled = true;
          // document.getElementById("empresa").disabled = true;
        } else {
          swal.fire({
            icon: 'error',
            title: 'Ya existe un usuario relacionado a la empresa seleccionada.',
            showConfirmButton: true
          }).then((result) => {
            console.log('redireccionando a login');
            //this.router.navigate(['/login']);
            //this.router.navigate(['/']);
            if (this.usuarioServicio.grupoEmpresarial != null) {
              this.router.navigate(['/login', this.usuarioServicio.grupoEmpresarial]);
              //this.router.navigate(['/']);
            } else {
              this.router.navigate(['/login']);
            }
          });
         }
       }
     );
  }

  consultarCorreo() {
    this.loginService.getCorreoAsociadoPersonaEmpresa(this.formulario.get('documento').value, this.formulario.get('nitempresa').value, this.usuarioServicio.cadenaConexion)
    .subscribe(
      data => {
        if (data['result'] && (data['result'] != null || data['result'] !== '')) {
          this.formulario.get('correo').setValue(data['result']);
          document.getElementById('divCorreo').style.display = '';
          console.log( data['result']);
        } else {
          this.habilitaCamposClave = false;
          swal.fire({
            icon: 'error',
            title: 'No existe un correo relacionado.',
            text: 'Por favor verifique su correo asociado con el área de recursos humanos y/o nómina para poder crear su usuario de Kiosco',
            showConfirmButton: true
          }).then((result) => {
            //this.router.navigate(['/login']);
            //this.router.navigate(['/']);
            if (this.usuarioServicio.grupoEmpresarial != null) {
              this.router.navigate(['/login', this.usuarioServicio.grupoEmpresarial]);
              //this.router.navigate(['/']);
            } else {
              this.router.navigate(['/login']);
            }
          });
        }
      }
    );
  }

  crearUsuario() {
    Object.values( this.formulario.controls ).forEach( control => {
      control.markAsTouched();
    });

    if (this.formulario.valid) {
      this.habilitaCamposClave = false;
      document.getElementById('loader').style.display = '';
      document.getElementById('mensaje').innerHTML = 'Estamos validando la información';
      let seudonimoCuenta;
      if (this.formulario.get('seudonimo').value === 'correo') {
        seudonimoCuenta = this.formulario.get('correo').value;
      } else {
        seudonimoCuenta = this.formulario.get('documento').value;
      }
      this.loginService.registrarUsuario(seudonimoCuenta, this.formulario.get('documento').value,
        this.formulario.get('pass1').value, this.formulario.get('nitempresa').value,
        this.formulario.get('correo').value, this.usuarioServicio.cadenaConexion)
        .subscribe(
          info => {
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
                  // document.location.href = './login';
                  //this.router.navigate(['/login']);
                  //this.router.navigate(['/']);
                  if (this.usuarioServicio.grupoEmpresarial != null) {
                    this.router.navigate(['/login', this.usuarioServicio.grupoEmpresarial]);
                    //this.router.navigate(['/']);
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
      return false;
    }
    console.log('recibido', this.formulario);
  }


enviarCorreoConfirmaCuenta(seudonimo: string) {
  console.log('enviarCorreoConfirmación');
  swal.fire({
    title: 'Espera un momento.. Estamos enviándote el correo de confirmación',
    onBeforeOpen: () => {
      swal.showLoading();
      this.loginService.enviarCorreoConfirmaCuenta(
        seudonimo,
        this.formulario.get('pass1').value,
        this.formulario.get('nitempresa').value, 'www.nominadesigner.co', this.usuarioServicio.cadenaConexion, this.usuarioServicio.grupoEmpresarial)
      .subscribe(
        data => {
          if (data['envioCorreo'] === true) {
            console.log('Por favor verifica tu cuenta de correo');
            swal.fire({
              icon: 'success',
              title: '¡Revisa tu correo!',
              text: 'Se te ha enviado un correo a ' + this.formulario.get('correo').value +
              ' para que valides tu cuenta. Recuerda que tienes una hora para validarla, de lo contrario ' +
              'deberas solicitar la generación de un nuevo correo.',
              showConfirmButton: true
            }).then((result) => {
              if (result.value) {
                // document.location.href = './login';
                //this.router.navigate(['/login']);
                //this.router.navigate(['/']);
                this.redirigirInicio();
              }
            });
          } else {
            swal.fire({
              icon: 'error',
              title: 'Se ha presentado un error al enviarte el correo de confirmación.',
              text: '¡No fue posible enviarte el correo para confirmar tu cuenta, por favor intenta iniciar sesión '+
              'y haz clic en la opción para enviarte nuevamente el correo.',
              showConfirmButton: true
            }).then((result) => {
              if (result.value) {
                // document.location.href = './login';
                this.redirigirInicio();
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
          }).then(
            (result) => {
              if (result.value) {
                // document.location.href = './login';
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
  if (this.grupoEmpresarial!=null) {
     this.router.navigate(['/login', this.grupoEmpresarial]);
  } else {
     this.router.navigate(['/']);
  }
  
}

}
