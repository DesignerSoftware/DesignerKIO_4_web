import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ValidadoresService } from 'src/app/services/validadores.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  formulario: FormGroup;
  usuario;
  empresa;
  habilitaCamposClave = false;
  empresas;

  constructor(private fb: FormBuilder, private router: Router, private loginService: LoginService,
              private usuarioServicio: UsuarioService, private validadores: ValidadoresService) {
    this.crearFormulario();
    this.usuarioServicio.getEmpresas()
    .subscribe(
      data => {
        this.empresas = data;
      }
    )
  }

  ngOnInit() {
  }

  crearFormulario() {
    this.formulario = this.fb.group({
      documento: ['', [Validators.required, Validators.pattern("^([0-9])*$")]],
      correo: ['', Validators.required],
      nitempresa: ['', [Validators.required, Validators.pattern("^([0-9])*$")] ],
      seudonimo: [, Validators.required],
      pass1: [, [Validators.required, Validators.pattern("^((?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%\\*\\.\\-_\\+~\\/;,\\(\\)!\\&]).{8,})$")]],
      pass2: [, [Validators.required]]
    },
    {
      validators: this.validadores.passwordIguales('pass1', 'pass2')
    });
  }

  validarUsuario() { // validar si existe 
    console.log(this.formulario);
    Object.values( this.formulario.controls ).forEach( control => {
      control.markAsTouched();
    });
    if (this.formulario.get('documento').valid && this.formulario.get('nitempresa').valid) {
      this.loginService.validarUsuarioYEmpresa(this.formulario.get('documento').value, this.formulario.get('nitempresa').value)
      .subscribe(
        data => {
          if (data['result'] === 'true') {
            console.log('usuario valido');

            this.validarUsuarioRegistrado();
          } else {
            swal.fire({
              icon: 'error',
              title: 'El usuario o el nit de la empresa no son correctos.',
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
      this.formulario.get('nitempresa').value
     )
     .subscribe(
       data => {
         console.log(data);
         if (data['result']==="false"){
          this.habilitaCamposClave = true;
          this.consultarCorreo();
          this.formulario.get('pass1').markAsUntouched();
          this.formulario.get('pass2').markAsUntouched();
          this.formulario.get('seudonimo').markAsUntouched();
         } else {
          swal.fire({
            icon: 'error',
            title: 'Ya existe un usuario registrado al nit de la empresa digitada.',
            showConfirmButton: true
          }).then((result) => {
            console.log('redireccionando a login');
            this.router.navigate(['/login']);
          })
         }
       }
     )
  }

  consultarCorreo() {
    this.loginService.getCorreoAsociadoPersonaEmpresa(this.formulario.get('documento').value, this.formulario.get('nitempresa').value)
    .subscribe(
      data => {
        if (data['result']!=null || data['result']!='') {
          this.formulario.get('correo').setValue(data['result']);
          document.getElementById('divCorreo').style.display='';
          console.log( data['result']);
        } else {
          alert('Por favor verifique su correo asociado con el área de recursos humanos y nómina para poder crear su usuario de Kiosco')
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
      document.getElementById('loader').style.display='';
      document.getElementById('mensaje').innerHTML='Estamos validando su información';
      var seudonimoCuenta;
      if (this.formulario.get('seudonimo').value === 'correo') {
        seudonimoCuenta = this.formulario.get('correo').value;
      } else {
        seudonimoCuenta = this.formulario.get('documento').value;
      }
      this.loginService.registrarUsuario(seudonimoCuenta, this.formulario.get('documento').value,
        this.formulario.get('pass1').value, this.formulario.get('nitempresa').value,
        this.formulario.get('correo').value)
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
            // document.location.href = './login';
            //this.router.navigate(['/login']);
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
            this.router.navigate(['/login']);
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
    title: 'Espera un momento.. Estamos enviandote el correo de confirmación',
    onBeforeOpen: () => {
      swal.showLoading();
      this.loginService.enviarCorreoConfirmaCuenta(
        seudonimo,
        this.formulario.get('pass1').value,
      this.formulario.get('nitempresa').value, 'www.nominadesigner.co')
      .subscribe(
        data => {
          if (data['envioCorreo']==true) {
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
                this.router.navigate(['/login']);
              }
            });
          } else {
            swal.fire({
              icon: 'error',
              title: 'Hubo un error al enviarte el correo de confirmación.',
              text: '¡No fue posible enviarte el correo para confirmar tu cuenta, por favor intenta iniciar sesión para enviarte '+
              'nuevamente el correo.',
              showConfirmButton: true
            }).then((result) => {
              if (result.value) {
                // document.location.href = './login';
                this.router.navigate(['/login']);
              }
            });
          }
        },
        (error) => {
          swal.fire({
            icon: 'error',
            title: 'Hubo un error al enviarte el correo de confirmación.',
            text: '¡No fue posible enviarte el correo para confirmar tu cuenta, por favor intenta iniciar sesión para enviarte '+
            'nuevamente el correo.',
            showConfirmButton: true
          });
        }
      );
    },
    allowOutsideClick: () => !swal.isLoading()
  });
}


redirigirInicio() {
  this.router.navigate(['/login']);
}


}