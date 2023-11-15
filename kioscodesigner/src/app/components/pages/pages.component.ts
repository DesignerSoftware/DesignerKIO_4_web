import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { KiopersonalizacionesService } from 'src/app/services/kiopersonalizaciones.service';
import { LoginService } from 'src/app/services/login.service';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';
import swal from 'sweetalert2';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  fotoPerfil: any = null;
  url: string = 'assets/images/fotos_empleados/sinFoto.jpg';
  datoHijo: any = 'Sin datos';
  logoEmpresa: any = null;
  urlLogoEmpresa: any;
  urlLogoEmpresaMin: any;
  urlLogoEmpresaDarkXl: any;

  constructor(public opcionesKioskosServicio: OpcionesKioskosService, private router: Router,
    public usuarioServicio: UsuarioService, private loginService: LoginService,
    private cadenasKioskos: CadenaskioskosappService, private kioPersonalizaciones: KiopersonalizacionesService) {
    this.getInfoUsuario();
    console.log('PagesComponent constructor');
  }

  ngOnInit() {
  }

  cargarDatosIniciales() {
    this.validarSesion();
    // cargar la foto del usuario conectado
    this.cargaFoto(); 
    this.cargaLogo();
    this.consultarDatosContacto();
    this.cargarDatosPersonales();

  }

  // obtener la información del usuario del localStorage y guardarla en el service
  getInfoUsuario() { 
    const sesion = this.usuarioServicio.getUserLoggedIn();
    this.usuarioServicio.setUsuario(sesion['usuario']);
    this.usuarioServicio.setEmpresa(sesion['empresa']);
    this.usuarioServicio.setTokenJWT(sesion['JWT']);
    this.usuarioServicio.setGrupo(sesion['grupo']);
    this.usuarioServicio.setUrlKiosco(sesion['urlKiosco']);
    let cadenasApp: any;
    this.cadenasKioskos.getCadenaKioskoXGrupoNit(sesion['grupo'], sesion['empresa'])
      .subscribe(
        (data: any) => {
          for (let i in data) {
            if (data[i][3] === sesion['grupo']) { // GRUPO
              const temp = data[i];
              this.usuarioServicio.cadenaConexion = temp[4];
              this.cargarDatosIniciales();
            }
          }  /** Fin for **/
        }
      );
  }

  cargarDatosPersonales() {
    if (this.usuarioServicio.datosPersonales == null) {
      this.usuarioServicio.getDatosUsuarioCadena(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
        .subscribe(
          (data: any) => {
            this.usuarioServicio.datosPersonales = data;
            const nombrePersona = data[0][1];
            this.usuarioServicio.nombrePersona = nombrePersona.trim().split(' ', 1) + '';
            this.usuarioServicio.nombreApellidoPersona = nombrePersona.trim().split(' ', 1) + ' ' + data[0][2];
            this.usuarioServicio.correo = data[0][12];
            if (this.usuarioServicio.correo?.length > 30) {
              this.usuarioServicio.correo = this.usuarioServicio.correo.slice(0, 30) + '...';
            }
          }
        );
    }
  }

  cargaFoto() {
    this.url = `${environment.urlKioskoReportes}conexioneskioskos/obtenerFotoPerfil?cadena=${this.usuarioServicio.cadenaConexion}&usuario=${this.usuarioServicio.usuario}&nit=${this.usuarioServicio.empresa}`;
  }

  cargaLogo() {
    this.usuarioServicio.getLogoEmpresa(this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
      .subscribe(
        (data: any) => {
          this.logoEmpresa = data['LOGO'];
          this.urlLogoEmpresa = `${environment.urlKioskoReportes}conexioneskioskos/obtenerLogo/${this.logoEmpresa}-light-xl.png?nit=${this.usuarioServicio.empresa}&cadena=${this.usuarioServicio.cadenaConexion}`;
          this.urlLogoEmpresaMin = `${environment.urlKioskoReportes}conexioneskioskos/obtenerLogo/${this.logoEmpresa}-mini.png?nit=${this.usuarioServicio.empresa}&cadena=${this.usuarioServicio.cadenaConexion}`;
          this.urlLogoEmpresaDarkXl = `${environment.urlKioskoReportes}conexioneskioskos/obtenerLogo/${this.logoEmpresa}-dark-xl.png?nit=${this.usuarioServicio.empresa}&cadena=${this.usuarioServicio.cadenaConexion}`;
          this.usuarioServicio.urlLogoEmpresa = this.urlLogoEmpresa;
          this.usuarioServicio.urlLogoEmpresaMin = this.urlLogoEmpresaMin;
          this.usuarioServicio.urlLogoEmpresaDarkXl = this.urlLogoEmpresaDarkXl;
        },
        (error: any) => {
          this.urlLogoEmpresa = 'assets/images/fotos_empleados/logodesigner-light-xl.png';
          this.urlLogoEmpresaMin = `${environment.urlKioskoReportes}conexioneskioskos/obtenerLogo/${this.logoEmpresa}-mini.png?nit=${this.usuarioServicio.empresa}&cadena=${this.usuarioServicio.cadenaConexion}`;
          this.urlLogoEmpresaDarkXl = `${environment.urlKioskoReportes}conexioneskioskos/obtenerLogo/${this.logoEmpresa}-dark-xl.png?nit=${this.usuarioServicio.empresa}&cadena=${this.usuarioServicio.cadenaConexion}`;
          this.usuarioServicio.urlLogoEmpresa = this.urlLogoEmpresa;
          this.usuarioServicio.urlLogoEmpresaMin = this.urlLogoEmpresaMin;
          this.usuarioServicio.urlLogoEmpresaDarkXl = this.urlLogoEmpresaDarkXl;
        }
      );
  }

  cambiarRuta(indexOpc: number) {
    this.router.navigate(['/', this.opcionesKioskosServicio.opcionesKioskos[indexOpc]['nombreruta']]);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.navigate();
    this.loginService.logOut(); // Limpiar datos
  }

  mostrarModalCambiarFoto() {
    $('#modalCambioFoto').modal('show');
  }

  min() {
    $('.sidebar-offcanvas').toggleClass('active');
  }

  min1() {
    $('.sidebar-offcanvas').toggleClass('active');
  }

  funCambiar(e: any) {
    this.datoHijo = e;
    this.url = e;
  }

  validarSesion() {
    this.usuarioServicio.validaToken(this.usuarioServicio.tokenJWT, this.usuarioServicio.cadenaConexion)
      .subscribe(
        (data: any) => {
          if (data['validoToken']) {
            this.loginService.validarUsuarioYEmpresa(data['documento'], this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
              .subscribe(
                (dat: any) => {
                  if (dat['result'] === 'true') {
                    // usuario activo a la empresa
                    this.loginService.validarSeudonimoYNitEmpresaRegistrado(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
                      .subscribe(
                        (datos: any) => {
                          if (datos['result'] !== 'true') {
                            swal.fire({
                              icon: 'error',
                              title: 'Su sesión ha expirado',
                              text: 'Por favor inicie sesión nuevamente.',
                              showConfirmButton: true
                            }).then((result: any) => {
                              this.logout();
                            });
                          }
                        }
                      );

                  } else {
                    swal.fire({
                      icon: 'error',
                      title: 'Su sesión ha expirado',
                      text: 'Por favor inicie sesión nuevamente',
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

  consultarDatosContacto() {
    let contactoSoporte = '';
    if (this.usuarioServicio.datosContacto == null) {
      this.kioPersonalizaciones.getDatosContacto(this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
        .subscribe(
          (data: any) => {
            this.usuarioServicio.datosContacto = data;
            for (let index = 0; index < this.usuarioServicio.datosContacto.length; index++) {
              contactoSoporte += data[index][0] + ' (' + data[index][1] + ')';
              if (index == this.usuarioServicio.datosContacto.length - 2) {
                contactoSoporte += ' y ';
              } else if (index == this.usuarioServicio.datosContacto.length - 1) {
                contactoSoporte += '. ';
              } else {
                contactoSoporte += ', ';
              }
            }

            this.usuarioServicio.nombreContactoSoporte = contactoSoporte;
          }
        );
    }
  }

  navigate() {
    if (this.usuarioServicio.grupoEmpresarial != null) {
      this.router.navigate(['/login', this.usuarioServicio.grupoEmpresarial]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  minbody2() {
    $('.sidebar-offcanvas').toggleClass('active');
  }
}
