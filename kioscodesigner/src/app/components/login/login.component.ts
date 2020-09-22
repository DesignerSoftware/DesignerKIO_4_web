import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from 'src/app/services/usuario.service';
import swal from 'sweetalert2';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  formulario: FormGroup;
  empresas;

  cadenaskioskos = [
   {
      id: 1,
      descripcion: 'TRONEX',
      cadena: 'DEFAULT1',
      nit: '811025446',
      fondo: 'fondoMenu.jpg',
      grupo: 'GrupoEmpresarial1',
    },
    {
      id: 2,
      descripcion: 'DESIGNER SOFTWARE LTDA',
      cadena: 'DEFAULT1',
      nit: '830045567',
      fondo: 'fondoMenu.jpg',
      grupo: 'GrupoEmpresarial2',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private loginService: LoginService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    console.log('usuario logueado', usuarioService.getUserLoggedIn());
    if (!usuarioService.getUserLoggedIn()) {
      this.crearFormulario();
      this.usuarioService.getEmpresas()
      .subscribe(
        data => {
          this.empresas = data;
          console.log(data);
        }
      );
    } else {
      this.navigate();
    }
  }

  ngOnInit() {
    if (this.cadenaskioskos.length === 1) {
      this.formulario.get('empresa').setValue(this.cadenaskioskos[0].nit); // si solo hay una empresa se asigna el nit de ésta por defecto
    } else {
      this.formulario.get('empresa').setValue('');
    }
  }

  crearFormulario() {
    this.formulario = this.fb.group({
      usuario: ['', Validators.required],
      clave: ['', Validators.required],
      empresa: [, Validators.required]
    });
  }

  enviar() {
    console.log(this.formulario);
    Object.values( this.formulario.controls ).forEach( control => {
      control.markAsTouched();
    });
    if (this.formulario.valid) {
      this.usuarioService.validarIngresoKioscoSeudonimo(this.formulario.get('usuario').value.toLowerCase(), 
      this.formulario.get('clave').value,
      this.formulario.get('empresa').value)
      .subscribe(
        data => {
          console.log(data);
          if (data['ingresoExitoso']) {
            this.loginService.generarToken(this.formulario.get('usuario').value.toLowerCase(),
            this.formulario.get('clave').value, this.formulario.get('empresa').value)
            .subscribe(
              res => {
                let jwt:any = JSON.parse(JSON.stringify(res));
                console.log('JWT Generado: ' + jwt['JWT']);
                if (!res) {
                  swal.fire('Objeto Vacio!!!', ' :(', 'success');
                } else {
                  let timerInterval;
                  swal.fire({
                    title: 'Bienvenido...',
                    html: 'Espere un momento mientras lo redireccionamos a la página de inicio',
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
                      const sesion: any = {
                        usuario: this.formulario.get('usuario').value.toLowerCase(),
                        JWT: jwt['JWT'],
                        empresa: this.formulario.get('empresa').value
                      };
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
                          text: 'Error de conexión. Por favor intentélo de nuevo más tarde. Error: cod ' + error.status + ' :' + error.statusText
                        });
              },
              () => this.navigate()
            );
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


    navigate() {
      this.router.navigate(['/home']);
    }

    mostrarModalContacto() {
      if (this.formulario.get('empresa').value) {
        console.log('presiono botón');
        $('#staticBackdrop').modal('show');
      } else {
        swal.fire({
          icon: 'error',
          title: 'Por favor seleccione una empresa',
          text: 'Seleccione la empresa a la que pertenece para indicarle con quien puede contactarse.',
          showConfirmButton: true
        });
      }

    }

  }
