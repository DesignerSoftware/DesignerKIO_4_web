import { Component, OnInit, Input } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { UsuarioService } from '../../../services/usuario.service';
import { ReportesService } from 'src/app/services/reportes.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import swal from 'sweetalert2';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() urlFotoPerfil = 'assets/images/fotos_empleados/sinFoto.jpg'; // recibe valor de pages.component
  opcionesKioskos: any;
  opcionesKioskosAntes: any;
  nombreUsuario;
  fotoPerfil;
  datos;

  constructor(private opcionesKioskosService: OpcionesKioskosService, private cadenasKioskos: CadenaskioskosappService,
              public usuarioServicio: UsuarioService, private loginService: LoginService, private router: Router, private reporteService: ReportesService) {
    //console.log(this.usuarioServicio.tokenJWT);
    this.getInfoUsuario();
  }

  ngOnInit() {
    this.nombreUsuario = this.usuarioServicio.nombrePersona;
  }

  clic() {
    //console.log('hiciste clic');
    this.reporteService.reporteSeleccionado = null;
  }

  getInfoUsuario() {
    // obtener la información del usuario del localStorage y guardarla en el service
    const sesion = this.usuarioServicio.getUserLoggedIn();
    this.usuarioServicio.setUsuario(sesion['usuario']);
    this.usuarioServicio.setEmpresa(sesion['empresa']);
    this.usuarioServicio.setTokenJWT(sesion['JWT']);
    this.usuarioServicio.setGrupo(sesion['grupo']);
    this.usuarioServicio.setUrlKiosco(sesion['urlKiosco']);
    //console.log('usuario: ' + this.usuarioServicio.usuario + ' empresa: ' + this.usuarioServicio.empresa);
    if (this.usuarioServicio.cadenaConexion) {
      this.cargarDatosIniciales();
    } else {
      this.cadenasKioskos.getCadenaKioskoXGrupoNit(sesion['grupo'], sesion['empresa'])
        .subscribe(
          data => {
            //console.log('getInfoUsuario', data);
            //console.log(sesion['grupo']);
            for (let i in data) {
              if (data[i][3] === sesion['grupo']) { // GRUPO
                const temp = data[i];
                //console.log('cadena: ', temp[4]) // CADENA
                this.usuarioServicio.cadenaConexion = temp[4];
                //this.cargarDatosIniciales();
              }
            }
            this.cargarDatosIniciales();
          }
        );
    }
  }

  cargarDatosIniciales() {
    this.cargarOpciones();
    this.cargarNotificaciones();
    this.cargaFoto();
  }

  /*cargarOpciones() {
    let opkTempo: any = [];
    if (this.opcionesKioskosService.opcionesKioskos.length === 0 || this.opcionesKioskosService.opcionesKioskos == null
      || this.opcionesKioskosService.opcionesKioskos === []) {
      this.opcionesKioskosService.getOpcionesKiosco(this.usuarioServicio.empresa, this.usuarioServicio.usuario, this.usuarioServicio.cadenaConexion)
        .subscribe(
          data => {
            this.opcionesKioskosAntes = data;
            this.opcionesKioskosService.opcionesKioskos = data;
            this.usuarioServicio.datos = data;
            opkTempo = data;
            ////console.log('opcionesKioskosAntes::', JSON.stringify(opkTempo));
            this.opcionesKioskos = opkTempo.filter(
              (opcKio) => opcKio.clase === 'MENU'
            );
            ////console.log('opcionesKioskosapp 2 filtro::', this.opcionesKioskos);
          });
    } else {
      this.opcionesKioskos = this.opcionesKioskosService.opcionesKioskos;
      //console.log('opcionesKioskos', this.opcionesKioskos);
    }
  }*/

  cargarOpciones() {
    let opkTempo: any = [];
    if (this.opcionesKioskosService.opcionesKioskos.length === 0 || this.opcionesKioskosService.opcionesKioskos == null
      || this.opcionesKioskosService.opcionesKioskos === []) {
      this.opcionesKioskosService.getMenuOpcionesKiosco(this.usuarioServicio.empresa, this.usuarioServicio.usuario, this.usuarioServicio.cadenaConexion)
        .subscribe(
          data => {
            this.opcionesKioskosAntes = data;
            this.usuarioServicio.datos = data;
            opkTempo = data;
            //console.log('opcionesKioskosAntes::', JSON.stringify(opkTempo));
            this.opcionesKioskos = opkTempo;
            this.opcionesKioskosService.opcionesKios = opkTempo;
            //console.log('opcionesKioskosapp 2 filtro::', this.opcionesKioskos);
          });
          console.log('opcionesKios ',this.opcionesKioskosService.opcionesKios);
          
    } else {
      this.opcionesKioskos = this.opcionesKioskosService.opcionesKioskos;
      //console.log('opcionesKioskos', this.opcionesKioskos);
    }
  }

  cargarNotificaciones() {
    this.usuarioServicio.getNotifiaciones(this.usuarioServicio.usuario,'VACACION' , this.usuarioServicio.cadenaConexion,this.usuarioServicio.empresa)
      .subscribe(
        data => {
          this.usuarioServicio.notificacionesVacaciones = data[0];
          // console.log('cant Notificaciones vacas:', this.usuarioServicio.notificacionesVacaciones.length);
          //console.log('cant Notificaciones vacas:', this.usuarioServicio.notificacionesVacaciones[0]);
        });

    this.usuarioServicio.getNotifiaciones(this.usuarioServicio.usuario,'AUSENTISMO' , this.usuarioServicio.cadenaConexion,this.usuarioServicio.empresa)
      .subscribe(
        data => {
          this.usuarioServicio.notificacionesAusentismo = data[0];
        });
  }

  cargaFoto() {
    //console.log('getDocumentoSidebar');
    this.usuarioServicio.getDocumentoSeudonimo(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
      .subscribe(
        data => {
          //console.log(data);
          this.fotoPerfil = data['result'];
          //console.log('documento: ' + this.fotoPerfil);
          document.getElementById('fotoPerfil').setAttribute('src',
            `${environment.urlKioskoReportes}conexioneskioskos/obtenerFoto/${this.fotoPerfil}.jpg?cadena=${this.usuarioServicio.cadenaConexion}&usuario=${this.usuarioServicio.usuario}&empresa=${this.usuarioServicio.empresa}`);
        }
      );
  }

  logout() {
    //console.log('cerrar sesion');
    localStorage.removeItem('currentUser');
    // this.router.navigate(['/login']);
    //this.router.navigate(['/']);
    if (this.usuarioServicio.grupoEmpresarial != null) {
      this.router.navigate(['/login', this.usuarioServicio.grupoEmpresarial]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  minbody2() {
    $('.sidebar-offcanvas').toggleClass('active');
    //console.log('presionado 2');
  }


}
