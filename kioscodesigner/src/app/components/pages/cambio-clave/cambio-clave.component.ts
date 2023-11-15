import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ValidadoresService } from 'src/app/services/validadores.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-cambio-clave',
  templateUrl: './cambio-clave.component.html',
  styleUrls: ['./cambio-clave.component.scss']
})
export class CambioClaveComponent implements OnInit {

  formulario: FormGroup = {} as FormGroup;

  constructor(private fb: FormBuilder,
    private validadores: ValidadoresService,
    private usuarioServicio: UsuarioService,
    private loginService: LoginService,
    private router: Router) {
    this.crearFormulario();
  }

  ngOnInit() {
    this.crearFormulario();
  }

  crearFormulario() {
    this.formulario = this.fb.group({
      passActual: ['', Validators.required],
      pass1: ['', [Validators.required, Validators.pattern("^((?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%\\*\\.\\-_\\+~\\/;,\\(\\)!\\&]).{8,})$")]],
      pass2: ['', [Validators.required]]
    },
      {
        validators: this.validadores.passwordIguales('pass1', 'pass2')
      });
  }

  enviar() {
    Object.values(this.formulario.controls).forEach(control => {
      control.markAsTouched();
    });
    console.log(this.formulario);
    if (this.formulario.valid) {
      this.usuarioServicio.validarSeudonimoClaveNit(
        this.usuarioServicio.usuario, this.formulario.get('passActual')!.value, this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion
      )
        .subscribe(
          (data: any) => {
            console.log(data);
            if (data['result'] === 'true') { 
              // si la contraseña actual es correcta
              this.actualizaClave();
            } else {
              swal.fire(
                '¡Contraseña incorrecta!',
                'La contraseña actual no coincide!',
                'error'
              );
            }
          }
        );
    }
  }

  actualizaClave() {
    swal.fire({
      title: 'Espera un momento... Estamos actualizando tu contraseña.',
      willOpen: () => {
        swal.showLoading();
        setTimeout(() => {
          this.usuarioServicio.actualizaClave(
            this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.formulario.get('pass1')!.value, this.usuarioServicio.cadenaConexion
          )
            .subscribe(
              data => {
                if (data === 1) {
                  this.usuarioServicio.inactivaTokensTipo('LOGIN', this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
                    .subscribe(
                      (data: any) => {
                        //console.log('inactiva tokens', data['modificado']);
                        if (data['modificado']) {
                          swal.fire({
                            icon: 'success',
                            title: '¡Tu contraseña ha sido actualizada exitosamente!',
                            text: 'Debes iniciar sesión nuevamente.',
                            showConfirmButton: true
                          }).then((result) => {
                            if (result.value) {
                              this.logout();
                            }
                          });
                        }
                      }
                    )
                } else {
                  swal.fire({
                    icon: 'error',
                    title: 'Hubo un error al actualizar tu contraseña.',
                    text: '¡No fue posible actualizar la contraseña, por favor intente de nuevo más tarde.',
                    showConfirmButton: true
                  }).then((result) => {
                    if (result.value) {
                      this.navegarHome();
                    }
                  });
                }
              },
              (error) => {
                console.log(error);
                swal.fire(
                  'Error!',
                  '¡Se presentó un error al intentar actualizar tu contraseña!. Por favor intentalo de nuevo más tarde.',
                  'error'
                );
              }
            );
        }, 1000);
      },
      allowOutsideClick: () => !swal.isLoading()
    });
  }

  // Dirigir a página de inicio
  navegarHome() { 
    this.router.navigate(['/home']);
  }

  logout() {
    console.log('cerrar sesion');
    localStorage.removeItem('currentUser');
    if (this.usuarioServicio.grupoEmpresarial != null) {
      this.router.navigate(['/login', this.usuarioServicio.grupoEmpresarial]);
    } else {
      this.router.navigate(['/login']);
    }
    // Limpiar datos
    this.loginService.logOut(); 
  }
}
