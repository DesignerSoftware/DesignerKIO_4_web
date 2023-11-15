import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AusentismosService } from 'src/app/services/ausentismos.service';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-ausentismos',
  templateUrl: './ausentismos.component.html',
  styleUrls: ['./ausentismos.component.scss']
})
export class AusentismosComponent implements OnInit {

  reporteSeleccionado = null;

  constructor(private opcionesKioskosServicio: OpcionesKioskosService,
    public usuarioServicio: UsuarioService,
    private router: Router,
    public ausentismosService: AusentismosService,
    private cadenasKioskos: CadenaskioskosappService
  ) {
  }

  ngOnInit() {
    if (this.usuarioServicio.cadenaConexion) {
      this.filtrarOpcionesReportes();
    } else {
      this.getInfoUsuario();
    }
  }

  // obtener la información del usuario del localStorage y guardarla en el service
  getInfoUsuario() {
    const sesion = this.usuarioServicio.getUserLoggedIn();
    this.usuarioServicio.setUsuario(sesion['usuario']);
    this.usuarioServicio.setEmpresa(sesion['empresa']);
    this.usuarioServicio.setTokenJWT(sesion['JWT']);
    this.usuarioServicio.setGrupo(sesion['grupo']);
    this.usuarioServicio.setUrlKiosco(sesion['urlKiosco']);
    this.cadenasKioskos.getCadenaKioskoXGrupoNit(sesion['grupo'], sesion['empresa'])
      .subscribe(
        (data: any) => {
          for (let i in data) {
            if (data[i][3] === sesion['grupo']) { // GRUPO
              const temp = data[i];
              this.usuarioServicio.cadenaConexion = temp[4];
              this.cargarDatosIniciales();
            }
          }
        }
      );
  }

  cargarDatosIniciales() {
    this.filtrarOpcionesReportes();
    this.getOpcionesDiagnosticos();
    this.cargarNotificaciones();
  }

  getOpcionesDiagnosticos() {
    if (!this.ausentismosService.codigosAusentismos || this.ausentismosService.codigosAusentismos != null) {
      this.ausentismosService.getCodigosAusentismos(this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
        .subscribe(
          (data: any) => {
            this.ausentismosService.codigosAusentismos = data;
          }
        )
    }
  }

  filtrarOpcionesReportes() {
    let opkTempo: any = [];
    if (this.ausentismosService.opciones == null || this.ausentismosService.opciones.length === 0
      //|| this.ausentismosService.opciones === []
    ) {
      opkTempo = this.opcionesKioskosServicio
        .getOpcionesKiosco(this.usuarioServicio.empresa, this.usuarioServicio.usuario, this.usuarioServicio.cadenaConexion)
        .subscribe((data: any) => {
          opkTempo = data;
          this.ausentismosService.opciones = opkTempo.filter(
            (opcKio: any) => {
              if (opcKio.opcionkioskopadre && opcKio.opcionkioskopadre.codigo === '40') {
                return true;
              } else {
                return false;
              }
            }
          );
        });
    } else {
    }
  }

  seleccionarReporte(index: number) {
    this.router.navigateByUrl(`/ausentismos/${this.ausentismosService.opciones[index]['nombreruta']}`)
  }

  redireccionarVacaciones() {
    this.router.navigateByUrl(`/ausentismos`)
  }

  imagenAusentismos(opcion: any) {
    if (opcion == "Reportar Ausentismo") {
      return "assets/images/icono_ausentismos1.png";
    } else if (opcion == "Ver mis ausentismos reportados") {
      return "assets/images/icono_ausentismos2.png";
    } else if (opcion == "Procesar ausentismos") {
      return "assets/images/icono_ausentismos3.png";
    } else if (opcion == "Ausentismos procesados") {
      return "assets/images/icono_ausentismos4.png";
    } else {
      return "assets/images/reporte.png";
    }
  }

  cargarNotificaciones() {
    this.usuarioServicio.loadAllNotifications();
  }
}
