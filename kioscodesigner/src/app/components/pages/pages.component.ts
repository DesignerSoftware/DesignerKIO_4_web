import { Component, OnInit } from '@angular/core';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';
import { LoginService } from 'src/app/services/login.service';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {
  fotoPerfil;
  url = 'assets/images/fotos_empleados/sinFoto.jpg';
  datoHijo = 'Sin datos';
  logoEmpresa;
  urlLogoEmpresa = null;
  urlLogoEmpresaMin;
  urlLogoEmpresaDarkXl;
  prue;

  constructor(public opcionesKioskosServicio: OpcionesKioskosService, private router: Router,
              public usuarioServicio: UsuarioService, private loginService: LoginService, 
              private cadenasKioskos: CadenaskioskosappService) {
    this.getInfoUsuario();
    this.validarSesion();
    this.cargaFoto(); // cargar la foto del usuario conectado
    this.cargaLogo();
  }

  ngOnInit() {
  }

  getInfoUsuario() { // obtener la información del usuario del localStorage y guardarla en el service
    const sesion = this.usuarioServicio.getUserLoggedIn();
    this.usuarioServicio.setUsuario(sesion['usuario']);
    this.usuarioServicio.setEmpresa(sesion['empresa']);
    this.usuarioServicio.setTokenJWT(sesion['JWT']);
    this.usuarioServicio.setGrupo(sesion['grupo']);
    console.log('usuario: ' + this.usuarioServicio.usuario + ' empresa: ' + this.usuarioServicio.empresa);
    this.cadenasKioskos.getCadenasKioskosEmp(sesion['grupo'])
    .subscribe(
      data => {
        console.log('getInfoUsuario', data);
        console.log(sesion['grupo']);
        for (let i in data) {
          if (data[i][3] === sesion['grupo']) { // GRUPO
          const temp = data[i];
          console.log('cadena: ', temp[4]) // CADENA
          this.usuarioServicio.cadenaConexion=temp[4];
          }
        }
        this.cargarDatosPersonales();
      }
    );
  }

  cargarDatosPersonales() {
    if (this.usuarioServicio.datosPersonales == null) {
      this.usuarioServicio.getDatosUsuarioCadena(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
      .subscribe(
        data => {
          this.usuarioServicio.datosPersonales = data;
          console.log('datosPer', this.usuarioServicio.datosPersonales);
          const nombrePersona = data[0][1];
          this.usuarioServicio.nombrePersona = nombrePersona.trim().split(' ', 1);
        }
      );
    }
  }

  cargaFoto() {
    console.log('getDocumento');
    this.usuarioServicio.getDocumentoSeudonimo(this.usuarioServicio.usuario, this.usuarioServicio.empresa)
    .subscribe(
      data => {
        console.log(data);
        this.fotoPerfil = data['result'];
        console.log('documento: ' + this.fotoPerfil);
        this.url = `${environment.urlKioskoReportes}conexioneskioskos/obtenerFoto/${this.fotoPerfil}.jpg`;
         // this.usuarioServicio.url = `${environment.urlKioskoReportes}conexioneskioskos/obtenerFoto/${this.fotoPerfil}.jpg`;
         // document.getElementById('perfil').setAttribute('src', `${environment.urlKioskoReportes}conexioneskioskos/obtenerFoto/${this.fotoPerfil}.jpg`);
      },
      error => {
        console.log("Se ha presentado un error: "+error);
        this.url = 'assets/images/fotos_empleados/sinfoto.jpg';
      }
    );
  }

  cargaLogo() {
    console.log('cargaLogo()');
    this.usuarioServicio.getLogoEmpresa(this.usuarioServicio.empresa)
    .subscribe(
      data => {
        console.log('logo', data);
        this.logoEmpresa = data['LOGO'];
        this.urlLogoEmpresa = `${environment.urlKioskoReportes}conexioneskioskos/obtenerLogo/${this.logoEmpresa}-light-xl.png`;
        this.urlLogoEmpresaMin = `${environment.urlKioskoReportes}conexioneskioskos/obtenerLogo/${this.logoEmpresa}-mini.png`;
        this.urlLogoEmpresaDarkXl = `${environment.urlKioskoReportes}conexioneskioskos/obtenerLogo/${this.logoEmpresa}-dark-xl.png`;
        this.usuarioServicio.urlLogoEmpresa = this.urlLogoEmpresa;
        this.usuarioServicio.urlLogoEmpresaMin = this.urlLogoEmpresaMin;
        this.usuarioServicio.urlLogoEmpresaDarkXl = this.urlLogoEmpresaDarkXl;
      },
      error => {
        console.log('Error: ' + error);
        this.urlLogoEmpresa = 'assets/images/fotos_empleados/logodesigner-light-xl.png';
        this.urlLogoEmpresaMin = `${environment.urlKioskoReportes}conexioneskioskos/obtenerLogo/${this.logoEmpresa}-mini.png`;
        this.urlLogoEmpresaDarkXl = `${environment.urlKioskoReportes}conexioneskioskos/obtenerLogo/${this.logoEmpresa}-dark-xl.png`;
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
    console.log('cerrar sesion');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
    this.loginService.logOut(); // Limpiar datos
    if (this.usuarioServicio.grupoEmpresarial != null) {
      // this.router.navigate(['/login', this.usuarioServicio.grupoEmpresarial]);
      this.router.navigate(['/']);
    } else {
      // this.router.navigate(['/login']);
      this.router.navigate(['/']);
    }
  }

  mostrarModalCambiarFoto() {
    console.log('presiono botón');
    /*$('#staticBackdrop').modal('show');
    $('#myModal').modal(options);*/
    $('#staticBackdrop').modal('show');
  }

  min() {
    console.log('presionado');
    $('.sidebar-offcanvas').toggleClass('active');
  }

  min1() {
    console.log('presionado 1');
    $('.sidebar-offcanvas').toggleClass('active');
  }

 

  funCambiar(e) {
    console.log(e);
    this.datoHijo = e;
    this.url = e;
  }

  validarSesion(){
    this.usuarioServicio.validaToken(this.usuarioServicio.tokenJWT)
    .subscribe(
      data => {
        console.log('validaToken', data);
        if (data['validoToken']) {
          console.log('El token es válido');
          this.loginService.validarUsuarioYEmpresa(data['documento'], this.usuarioServicio.empresa)
          .subscribe(
            dat => {
              if (dat['result'] === 'true'){
                  // usuario activo a la empresa

                  this.loginService.validarSeudonimoYNitEmpresaRegistrado(this.usuarioServicio.usuario, this.usuarioServicio.empresa)
                  .subscribe(
                    datos => {
                      if (datos['result'] !== 'true') {
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

}
