import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { LoginService } from 'src/app/services/login.service';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { ReportesService } from 'src/app/services/reportes.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() urlFotoPerfil: any;
  nombreUsuario: String = '';
  opcionesKioskosAntes: any;
  opcionesKioskos: any;

  constructor(private opcionesKioskosService: OpcionesKioskosService, private cadenasKioskos: CadenaskioskosappService,
    public usuarioServicio: UsuarioService, private loginService: LoginService, private router: Router, private reporteService: ReportesService) {
    this.getInfoUsuario();
  }

  ngOnInit() {
    this.nombreUsuario = this.usuarioServicio.nombrePersona;
  }

  clic() {
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
    if (this.usuarioServicio.cadenaConexion) {
      this.cargarDatosIniciales();
    } else {
      this.cadenasKioskos.getCadenaKioskoXGrupoNit(sesion['grupo'], sesion['empresa'])
        .subscribe(
          (data: any) => {
            for (let i in data) {
              if (data[i][3] === sesion['grupo']) { // GRUPO
                const temp = data[i];
                this.usuarioServicio.cadenaConexion = temp[4];
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
  }

  cargarOpciones() {
    let opkTempo: any = [];
    if (this.opcionesKioskosService.opcionesKioskos.length === 0 || this.opcionesKioskosService.opcionesKioskos == null
      //|| this.opcionesKioskosService.opcionesKioskos === []
      ) {
      this.opcionesKioskosService.getMenuOpcionesKiosco(this.usuarioServicio.empresa, this.usuarioServicio.usuario, this.usuarioServicio.cadenaConexion)
        .subscribe(
          data => {
            this.opcionesKioskosAntes = data;
            this.usuarioServicio.datos = data;
            opkTempo = data;
            this.opcionesKioskos = opkTempo;
            this.opcionesKioskosService.opcionesKios = opkTempo;
          });
    } else {
      this.opcionesKioskos = this.opcionesKioskosService.opcionesKioskos;
    }
  }

  cargarNotificaciones() {
    this.usuarioServicio.loadAllNotifications();
  }

  logout() {
    localStorage.removeItem('currentUser');
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
