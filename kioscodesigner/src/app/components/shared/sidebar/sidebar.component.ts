import { Component, OnInit, Input } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { UsuarioService } from '../../../services/usuario.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() urlFotoPerfil: string = 'assets/images/fotos_empleados/sinFoto.jpg'; // recibe valor de pages.component
  opcionesKioskos: any;
  public usuario: string = '';
  public empresa: string = '';
  private tokenJWT: string = '';
  private documento: string = '';
  nombreUsuario;
  fotoPerfil;
  datos;

  constructor(private opcionesKioskosService: OpcionesKioskosService,
              public usuarioServicio: UsuarioService, private loginService: LoginService, private router: Router) {
    const sesion = this.usuarioServicio.getUserLoggedIn();
    console.log(sesion);
    this.usuario = sesion['usuario'];
    this.empresa = sesion['empresa'];
    this.tokenJWT = sesion['JWT'];
    this.documento = sesion['documento'];
    console.log(this.tokenJWT);
    this.cargarOpciones();
    this.cargaFoto();
    this.nombreUsuario = this.usuarioServicio.nombrePersona;
    this.cargarDatos();
    this.verificarSesion();
  }

  ngOnInit() {

  }

  cargarOpciones() {
    if (this.opcionesKioskosService.opcionesKioskos.length === 0 || this.opcionesKioskosService.opcionesKioskos == null
      || this.opcionesKioskosService.opcionesKioskos === []) {
      this.opcionesKioskosService.getOpcionesKiosco(this.empresa)
        .subscribe(
          data => {
            this.opcionesKioskos = data;
            this.opcionesKioskosService.opcionesKioskos = data;
            this.usuarioServicio.datos = data;
            console.log('opcionesKioskos', this.opcionesKioskos);
          });
    } else {
      this.opcionesKioskos = this.opcionesKioskosService.opcionesKioskos;
      console.log('opcionesKioskos', this.opcionesKioskos);
    }
  }

  cargaFoto() {
    console.log('getDocumentoSidebar');
    this.usuarioServicio.getDocumentoSeudonimo(this.usuario, this.empresa)
    .subscribe(
      data => {
        console.log(data);
        this.fotoPerfil = data['result'];
        console.log('documento: ' + this.fotoPerfil);
        document.getElementById('fotoPerfil').setAttribute('src', `${environment.urlKioskoReportes}conexioneskioskos/obtenerFoto/${this.fotoPerfil}.jpg`);     
      }
    )
  }

  cargarDatos() {
    if (this.datos == null) {
      this.usuarioServicio.getDatosUsuario(this.usuario, this.empresa)
      .subscribe(
        data => {
          console.log('datos', this.datos);
          this.nombreUsuario = data['nombres'];
          this.nombreUsuario = this.nombreUsuario.trim().split(' ', 1);
        }
      );
    }
  }

  verificarSesion() {
    this.usuarioServicio.validaToken(this.tokenJWT)
    .subscribe(
      data => {
        console.log('validaToken', data);
        if (data['validoToken']) {
          console.log('El token es válido');
          this.loginService.validarUsuarioYEmpresa(data['documento'], this.empresa)
          .subscribe(
            dat => {
              if (dat['result'] === "true"){
                  // usuario activo a la empresa

                  this.loginService.validarSeudonimoYNitEmpresaRegistrado(this.usuario, this.empresa)
                  .subscribe(
                    datos => {
                      if (datos['result']!=="true"){
                        swal.fire({
                          icon: 'error',
                          // title: 'Sesión no válida',
                          title: 'Su sesión ha expirado',
                          text: 'Inicie sesión nuevamente.',
                          showConfirmButton: true
                        }).then((result) => {
                          this.logout();
                        });
                      }
                    }
                  );

              } else {
                swal.fire({
                  icon: 'error',
                  // title: 'Sesión inválida',
                  title: 'Su sesión ha expirado',
                  // text: data['mensaje'],
                  text: 'Inicie sesión nuevamente',
                  showConfirmButton: true
                }).then((result) => {
                  this.logout();
                });
              }
            }
          );

        } else {
          swal.fire({
            icon: 'error',
            // title: 'Sesión inválida',
            // text: data['mensaje'],
            title: 'Su sesión ha expirado',
            text: 'Inicie sesión nuevamente.',
            showConfirmButton: true
          }).then((result) => {
            this.logout();
          });
        }
      }
    );
  }


  logout() {
    console.log('cerrar sesion');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }


}
