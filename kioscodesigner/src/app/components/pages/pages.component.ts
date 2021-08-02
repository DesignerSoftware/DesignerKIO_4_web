import { Component, OnInit } from '@angular/core';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { NavigationEnd, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';
import { LoginService } from 'src/app/services/login.service';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import swal from 'sweetalert2';
import { KiopersonalizacionesService } from 'src/app/services/kiopersonalizaciones.service';

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

  constructor(public opcionesKioskosServicio: OpcionesKioskosService, private router: Router,
              public usuarioServicio: UsuarioService, private loginService: LoginService, 
              private cadenasKioskos: CadenaskioskosappService, private kioPersonalizaciones: KiopersonalizacionesService) {
    this.getInfoUsuario();
    //console.log('constructor pages');
  }

  ngOnInit() {
    //console.log('ngOnInit pages');
  }

  cargarDatosIniciales() {
    this.validarSesion();
    this.cargaFoto(); // cargar la foto del usuario conectado
    this.cargaLogo();
    this.consultarDatosContacto();
    this.cargarDatosPersonales();
  }

  getInfoUsuario() { // obtener la información del usuario del localStorage y guardarla en el service
    const sesion = this.usuarioServicio.getUserLoggedIn();
    this.usuarioServicio.setUsuario(sesion['usuario']);
    this.usuarioServicio.setEmpresa(sesion['empresa']);
    this.usuarioServicio.setTokenJWT(sesion['JWT']);
    this.usuarioServicio.setGrupo(sesion['grupo']);
    this.usuarioServicio.setUrlKiosco(sesion['urlKiosco']);
    //console.log('usuario: ' + this.usuarioServicio.usuario + ' empresa: ' + this.usuarioServicio.empresa);
    let cadenasApp: any;
    this.cadenasKioskos.getCadenasKioskosEmp(sesion['grupo'])
    .subscribe(
      data => {
        //console.log('getInfoUsuario', data);
        //console.log(sesion['grupo']);
        for (let i in data) {

         /* cadenasApp = data;
          console.log(data[i][7]);
          if (data[i][7] == 'INACTIVO') {
            this.loginService.kioscoActivo = false;
            this.loginService.mensajeKioscoInactivo = data[i][8];
          }
          if (!this.loginService.kioscoActivo) {
            console.log('estado Kiosco (pages): ' + this.loginService.kioscoActivo);
            //this.navigate();
          }*/



          if (data[i][3] === sesion['grupo']) { // GRUPO
            const temp = data[i];
            //console.log('cadena: ', temp[4]) // CADENA
            this.usuarioServicio.cadenaConexion = temp[4];
            //console.log('pages CADENA: ', this.usuarioServicio.cadenaConexion)
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
        data => {
          this.usuarioServicio.datosPersonales = data;
          //console.log('datosPer', this.usuarioServicio.datosPersonales);
          const nombrePersona = data[0][1];
          this.usuarioServicio.nombrePersona = nombrePersona.trim().split(' ', 1);
          this.usuarioServicio.correo = data[0][12];
        }
      );
    }
  }

  cargaFoto() {
    //console.log('getDocumento');
    this.usuarioServicio.getDocumentoSeudonimo(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
    .subscribe(
      data => {
        //console.log(data);
        this.fotoPerfil = data['result'];
        //console.log('documento: ' + this.fotoPerfil);
        this.url = `${environment.urlKioskoReportes}conexioneskioskos/obtenerFoto/${this.fotoPerfil}.jpg?cadena=${this.usuarioServicio.cadenaConexion}&usuario=${this.usuarioServicio.usuario}&empresa=${this.usuarioServicio.empresa}`;
         // this.usuarioServicio.url = `${environment.urlKioskoReportes}conexioneskioskos/obtenerFoto/${this.fotoPerfil}.jpg`;
         // document.getElementById('perfil').setAttribute('src', `${environment.urlKioskoReportes}conexioneskioskos/obtenerFoto/${this.fotoPerfil}.jpg`);
      },
      error => {
        //console.log("Se ha presentado un error: "+error);
        this.url = 'assets/images/fotos_empleados/sinfoto.jpg';
      }
    );
  }

  cargaLogo() {
    //console.log('cargaLogo()');
    this.usuarioServicio.getLogoEmpresa(this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
    .subscribe(
      data => {
        //console.log('logo', data);
        this.logoEmpresa = data['LOGO'];
        this.urlLogoEmpresa = `${environment.urlKioskoReportes}conexioneskioskos/obtenerLogo/${this.logoEmpresa}-light-xl.png?nit=${this.usuarioServicio.empresa}&cadena=${this.usuarioServicio.cadenaConexion}`;
        this.urlLogoEmpresaMin = `${environment.urlKioskoReportes}conexioneskioskos/obtenerLogo/${this.logoEmpresa}-mini.png?nit=${this.usuarioServicio.empresa}&cadena=${this.usuarioServicio.cadenaConexion}`;
        this.urlLogoEmpresaDarkXl = `${environment.urlKioskoReportes}conexioneskioskos/obtenerLogo/${this.logoEmpresa}-dark-xl.png?nit=${this.usuarioServicio.empresa}&cadena=${this.usuarioServicio.cadenaConexion}`;
        this.usuarioServicio.urlLogoEmpresa = this.urlLogoEmpresa;
        this.usuarioServicio.urlLogoEmpresaMin = this.urlLogoEmpresaMin;
        this.usuarioServicio.urlLogoEmpresaDarkXl = this.urlLogoEmpresaDarkXl;
      },
      error => {
        //console.log('Error: ' + error);
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
    //console.log('cerrar sesion');
    localStorage.removeItem('currentUser');
    this.navigate();
    this.loginService.logOut(); // Limpiar datos
  }

  mostrarModalCambiarFoto() {
    //console.log('presiono botón');
    /*$('#staticBackdrop').modal('show');
    $('#myModal').modal(options);*/
    $('#modalCambioFoto').modal('show');
  }

  min() {
    //console.log('presionado');
    $('.sidebar-offcanvas').toggleClass('active');
  }

  min1() {
    //console.log('presionado 1');
    $('.sidebar-offcanvas').toggleClass('active');
  }

  funCambiar(e) {
    //console.log(e);
    this.datoHijo = e;
    this.url = e;
  }

  validarSesion() {
    this.usuarioServicio.validaToken(this.usuarioServicio.tokenJWT, this.usuarioServicio.cadenaConexion)
    .subscribe(
      data => {
        //console.log('validaToken', data);
        if (data['validoToken']) {
          //console.log('El token es válido');
          this.loginService.validarUsuarioYEmpresa(data['documento'], this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
          .subscribe(
            dat => {
              if (dat['result'] === 'true'){
                  // usuario activo a la empresa
                  this.loginService.validarSeudonimoYNitEmpresaRegistrado(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
                  .subscribe(
                    datos => {
                      if (datos['result'] !== 'true') {
                        swal.fire({
                          icon: 'error',
                          // title: 'Sesión no válida',
                          title: 'Su sesión ha expirado',
                          text: 'Por favor inicie sesión nuevamente.',
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

  consultarDatosContacto() {
    let contactoSoporte = '';
    if (this.usuarioServicio.datosContacto==null){
      this.kioPersonalizaciones.getDatosContacto(this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
      .subscribe(
        data => {
          this.usuarioServicio.datosContacto = data;
          //this.usuarioServicio.nombreContactoSoporte = data[0][0];
          for (let index = 0; index <  this.usuarioServicio.datosContacto.length; index++) {
            contactoSoporte+= data[index][0]+' ('+ data[index][1]+')';
            if (index==this.usuarioServicio.datosContacto.length-2) {
              contactoSoporte+=' y ';
            } else if(index==this.usuarioServicio.datosContacto.length-1){
              contactoSoporte+='. ';
            } else {
              contactoSoporte+=', ';
            }
          }
          
          //this.usuarioServicio.correoContactoSoporte = data[0][1];
          this.usuarioServicio.nombreContactoSoporte = contactoSoporte;
        }
      );
    }
  }

  navigate(){
    if (this.usuarioServicio.grupoEmpresarial!=null) {
      this.router.navigate(['/login', this.usuarioServicio.grupoEmpresarial]);
     //this.router.navigate(['/']);
   } else {
     this.router.navigate(['/login']);
   }
  }
    

}
