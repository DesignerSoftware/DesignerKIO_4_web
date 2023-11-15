import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VacacionesService } from 'src/app/services/vacaciones.service';

@Component({
  selector: 'app-vacaciones',
  templateUrl: './vacaciones.component.html',
  styleUrls: ['./vacaciones.component.scss']
})
export class VacacionesComponent implements OnInit {

  opcioneskioskoG: any = [];
  private usuario: string = '';
  private empresa: string = '';
  reporteSeleccionado = null;
  codigoReporteSeleccionado = null;

  constructor(private opcionesKioskosServicio: OpcionesKioskosService,
    public usuarioServicio: UsuarioService,
    private router: Router,
    public vacacionesService: VacacionesService,
    private cadenasKioskos: CadenaskioskosappService
  ) {
    this.vacacionesService.SolicitudesJefe = null;
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
              this.filtrarOpcionesReportes();
            }
          }
        }
      );
  }

  filtrarOpcionesReportes() {
    let opkTempo: any = [];
    if (this.vacacionesService.opcionesKiosco == null || this.vacacionesService.opcionesKiosco.length === 0 
      //|| this.vacacionesService.opcionesKiosco === []
      ) {
      opkTempo = this.opcionesKioskosServicio
        .getOpcionesKiosco(this.usuarioServicio.empresa, this.usuarioServicio.usuario, this.usuarioServicio.cadenaConexion)
        .subscribe((data) => {
          opkTempo = data;
          this.vacacionesService.opcionesKiosco = opkTempo.filter(
            (opcKio: any) => {
              if (opcKio.opcionkioskopadre && opcKio.opcionkioskopadre.codigo === '30') {
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
    this.router.navigateByUrl(`/vacaciones/${this.vacacionesService.opcionesKiosco[index]['nombreruta']}`)
  }

  redireccionarVacaciones() {
    this.router.navigateByUrl(`/vacaciones`)
  }

  imagenVacaciones(opcion: any) {
    if (opcion.indexOf("Crear Solicitud") > -1) {
      return "assets/images/icono_vacaciones1.png";
    } else if (opcion.indexOf("Ver solicitudes propias") > -1) {
      return "assets/images/icono_vacaciones2.png";
    } else if (opcion.indexOf("Procesar solicitudes") > -1) {
      return "assets/images/icono_vacaciones3.png";
    } else if (opcion.indexOf("Solicitudes procesadas") > -1) {
      return "assets/images/icono_vacaciones4.png";
    } else {
      return "assets/images/reporte.png";
    }
  }


}
