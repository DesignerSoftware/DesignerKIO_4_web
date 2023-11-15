import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { RecursosHumanosService } from 'src/app/services/recursoshumanos.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-recursos-humanos',
  templateUrl: './recursos-humanos.component.html',
  styleUrls: ['./recursos-humanos.component.scss']
})
export class RecursosHumanosComponent implements OnInit {

  opcioneskioskoG: any = [];
  reporteSeleccionado: any = null;
  codigoReporteSeleccionado: any = null;

  constructor(
    private opcionesKioskosServicio: OpcionesKioskosService, 
    public usuarioServicio: UsuarioService,
    private router: Router, 
    public recursosHumanosService: RecursosHumanosService, 
    private cadenasKioskos: CadenaskioskosappService
  ) {
  }

  ngOnInit() {
    if (this.usuarioServicio.cadenaConexion) {
      this.filtrarOpciones();
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
        data => {
          if (Array.isArray(data)) {
            var val1 = Object.values(data);
            val1.forEach((v1) => {
              if (Array.isArray(v1)) {
                var val2 = Object.values(v1);
                if (val2[3] === sesion['grupo']) { // GRUPO
                  this.usuarioServicio.cadenaConexion = val2[4];
                  this.cargarDatosIniciales();
                }
              }
            });
          }
        }
      );
  }

  cargarDatosIniciales() {
    this.filtrarOpciones();
    this.cargarNotificaciones();
  }

  filtrarOpciones() {
    let opkTempo: any = [];
    if (this.recursosHumanosService.opciones == null || this.recursosHumanosService.opciones.length === 0 
      //|| this.recursosHumanosService.opciones === []
      ) {
      opkTempo = this.opcionesKioskosServicio
        .getOpcionesKiosco(this.usuarioServicio.empresa, this.usuarioServicio.usuario, this.usuarioServicio.cadenaConexion)
        .subscribe((data) => {
          //console.log('opciones Consultadas', data);
          opkTempo = data;
          this.recursosHumanosService.opciones = opkTempo.filter(
            (opcKio: any) => {
              if (opcKio.opcionkioskopadre && opcKio.opcionkioskopadre.codigo === '50') {
                return true;
              } else {
                return null;
              }
            }
          );
        });
    }
  }

  seleccionarReporte(index: number) {
    let v_strVal: string = `/recursoshumanos/${this.recursosHumanosService.opciones[index]['nombreruta']}`;
    //this.router.navigateByUrl(`/recursoshumanos/${this.recursosHumanosService.opciones[index]['nombreruta']}`)
    console.log('v_strVal: ', v_strVal);
    this.router.navigateByUrl(v_strVal); 
  }

  redireccionarVacaciones() {
    this.router.navigateByUrl(`/recursoshumanos`)
  }

  imagenAusentismos(opcion: any) {
    if (opcion == "Reportar Ausentismo") {
      return "/assets/images/icono_ausentismos1.png";
    } else if (opcion == "Ver mis ausentismos reportados") {
      return "/assets/images/icono_ausentismos2.png";
    } else if (opcion == "Procesar ausentismos") {
      return "/assets/images/icono_ausentismos3.png";
    } else if (opcion == "Ausentismos procesados") {
      return "/assets/images/icono_ausentismos4.png";
    } else {
      return "/assets/images/reporte.png";
    }
  }
  cargarNotificaciones() {
    this.usuarioServicio.loadAllNotifications();
  }
}
