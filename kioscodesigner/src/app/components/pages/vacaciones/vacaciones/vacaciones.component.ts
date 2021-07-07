import { Component, OnInit } from '@angular/core';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VacacionesService } from 'src/app/services/vacaciones.service';
import { Router } from '@angular/router';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';

@Component({
  selector: 'app-vacaciones',
  templateUrl: './vacaciones.component.html',
  styleUrls: ['./vacaciones.component.css']
})
export class VacacionesComponent implements OnInit {
opcioneskioskoG: any = [];
private usuario: string;
private empresa: string;
//opcionesKiosco: any = [];
reporteSeleccionado = null;
codigoReporteSeleccionado = null;

  constructor(private opcionesKioskosServicio: OpcionesKioskosService, private usuarioServicio: UsuarioService, 
    private router: Router, public vacacionesService: VacacionesService, private cadenasKioskos: CadenaskioskosappService
    ) {
    //this.opcioneskioskoG = this.opcionesKioskosServicio.getOpcionesKiosco(this.empresa);
    this.vacacionesService.SolicitudesJefe = null;
    //console.log(this.opcioneskioskoG);
  }

  ngOnInit() {
    //console.log('ngOnInit() vacaciones');
    if (this.usuarioServicio.cadenaConexion) {
      this.filtrarOpcionesReportes();
    } else {
      this.getInfoUsuario();
    }   
  }

  getInfoUsuario() { // obtener la información del usuario del localStorage y guardarla en el service
    const sesion = this.usuarioServicio.getUserLoggedIn();
    this.usuarioServicio.setUsuario(sesion['usuario']);
    this.usuarioServicio.setEmpresa(sesion['empresa']);
    this.usuarioServicio.setTokenJWT(sesion['JWT']);
    this.usuarioServicio.setGrupo(sesion['grupo']);
    this.usuarioServicio.setUrlKiosco(sesion['urlKiosco']);
    //console.log('usuario: ' + this.usuarioServicio.usuario + ' empresa: ' + this.usuarioServicio.empresa);
    this.cadenasKioskos.getCadenasKioskosEmp(sesion['grupo'])
    .subscribe(
      data => {
        //console.log('getInfoUsuario', data);
        //console.log(sesion['grupo']);
        for (let i in data) {
          if (data[i][3] === sesion['grupo']) { // GRUPO
          const temp = data[i];
          //console.log('cadena: ', temp[4]) // CADENA
          this.usuarioServicio.cadenaConexion=temp[4];
          //console.log('pages CADENA: ', this.usuarioServicio.cadenaConexion)
          this.filtrarOpcionesReportes();
          }
        }
      }
    );
  }  

  filtrarOpcionesReportes() {
    let opkTempo: any = [];
    if (this.vacacionesService.opcionesKiosco == null || this.vacacionesService.opcionesKiosco.length === 0 || this.vacacionesService.opcionesKiosco === []) {
      opkTempo = this.opcionesKioskosServicio
        .getOpcionesKiosco(this.usuarioServicio.empresa, this.usuarioServicio.usuario, this.usuarioServicio.cadenaConexion)
        .subscribe((data) => {
          //console.log('opciones Consultadas', data);
          opkTempo = data;
          this.vacacionesService.opcionesKiosco = opkTempo.filter(
            //(opcKio) => opcKio['opcionkioskopadre']['codigo'] === '30'
            (opcKio) => {
              if (opcKio.opcionkioskopadre && opcKio.opcionkioskopadre.codigo==='30'){
                return true;
              }
            }
          );
          //this.vacacionesService.opcionesKiosco = opkTempo;
          // //console.log('filter 1', this.opcionesReportes[0]['SUBOPCION']);
           //console.log('filter 1', this.vacacionesService.opcionesKiosco);
        });
    } else {
      /*opkTempo = this.opcionesKioskosServicio.opcionesKioskos;
      this.opcionesReportes = opkTempo.filter(
        (opcKio) => opcKio['CODIGO'] === '20'
      );
      //console.log('filter 2', this.opcionesReportes[0]['SUBOPCION']);*/
    }
  }

  seleccionarReporte(index: number) {
    //console.log('seleccionarReporte');
    //console.log('opcionesActuales', this.vacacionesService.opcionesKiosco);
    //console.log(index);
    //this.reporteSeleccionado = this.opcionesReportes[0]['SUBOPCION'][index];
    // this.router.navigateByUrl(`/reportes/${index}`);
    //this.codigoReporteSeleccionado = this.opcionesReportes[0]['SUBOPCION'][index]['CODIGO'];
    this.router.navigateByUrl(`/vacaciones/${this.vacacionesService.opcionesKiosco[index]['nombreruta']}`)
    //console.log('opcionSeleccionada: ' +this.vacacionesService.opcionesKiosco[index]['nombreruta']);
  }

 redireccionarVacaciones(){
  this.router.navigateByUrl(`/vacaciones`)
 }

 imagenVacaciones(opcion: any){
    if (opcion.indexOf("Crear Solicitud")> -1) {
      return "assets/images/icono_vacaciones1.png";
    } else if (opcion.indexOf("Ver solicitudes propias")>-1) {
      return "assets/images/icono_vacaciones2.png";
    } else if (opcion.indexOf("Procesar solicitudes")>-1) {
      return "assets/images/icono_vacaciones3.png";
    } else if (opcion.indexOf("Solicitudes procesadas")>-1){
      return "assets/images/icono_vacaciones4.png";
    } else {
      return "assets/images/reporte.png";
    }
 }


}