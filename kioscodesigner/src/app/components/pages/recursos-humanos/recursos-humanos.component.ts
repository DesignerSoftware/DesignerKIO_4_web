import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { data } from 'jquery';
import { RecursosHumanosService } from 'src/app/services/recursoshumanos.service';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-recursos-humanos',
  templateUrl: './recursos-humanos.component.html',
  styleUrls: ['./recursos-humanos.component.css']
})
export class RecursosHumanosComponent implements OnInit {
  opcioneskioskoG: any = [];
  private usuario: string;
  private empresa: string;
  //opciones: any = [];
  reporteSeleccionado = null;
  codigoReporteSeleccionado = null;

  constructor(private opcionesKioskosServicio: OpcionesKioskosService, public usuarioServicio: UsuarioService,
    private router: Router, public recursosHumanosService: RecursosHumanosService, private cadenasKioskos: CadenaskioskosappService
  ) {
    //this.opcioneskioskoG = this.opcionesKioskosServicio.getopciones(this.empresa);
    //console.log(this.opcioneskioskoG);
  }

  ngOnInit() {
    //console.log(this.usuarioServicio.cadenaConexion);
    if (this.usuarioServicio.cadenaConexion) {
      this.filtrarOpciones();
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
    this.cadenasKioskos.getCadenaKioskoXGrupoNit(sesion['grupo'],sesion['empresa'])
    .subscribe(
      data => {
        ////console.log('getInfoUsuario', data);
        ////console.log(sesion['grupo']);
        for (let i in data) {
          if (data[i][3] === sesion['grupo']) { // GRUPO
          const temp = data[i];
          //console.log('cadena: ', temp[4]) // CADENA
          this.usuarioServicio.cadenaConexion=temp[4];
          //console.log('pages CADENA: ', this.usuarioServicio.cadenaConexion)
          this.cargarDatosIniciales();
          }
        }
      }
    );
  }  

  cargarDatosIniciales(){
    this.filtrarOpciones();
  }  

  filtrarOpciones() {
    let opkTempo: any = [];
    if (this.recursosHumanosService.opciones == null || this.recursosHumanosService.opciones.length === 0 || this.recursosHumanosService.opciones === []) {
      opkTempo = this.opcionesKioskosServicio
        .getOpcionesKiosco(this.usuarioServicio.empresa, this.usuarioServicio.usuario, this.usuarioServicio.cadenaConexion)
        .subscribe((data) => {
          //console.log('opciones Consultadas', data);
          opkTempo = data;
          this.recursosHumanosService.opciones = opkTempo.filter(
            //(opcKio) => opcKio['opcionkioskopadre']['codigo'] === '30'
            (opcKio) => {
              if (opcKio.opcionkioskopadre && opcKio.opcionkioskopadre.codigo==='50'){
                return true;
              }
            }
          );
        });
    } 
  }

  seleccionarReporte(index: number) {
    //console.log(index);
    //this.reporteSeleccionado = this.opcionesReportes[0]['SUBOPCION'][index];
    this.router.navigateByUrl(`/recursoshumanos/${this.recursosHumanosService.opciones[index]['nombreruta']}`)
  }

 redireccionarVacaciones(){
  this.router.navigateByUrl(`/recursoshumanos`)
 }

 imagenAusentismos(opcion: any){
    if (opcion =="Reportar Ausentismo") {
      return "assets/images/icono_ausentismos1.png";
    } else if (opcion == "Ver mis ausentismos reportados") {
      return "assets/images/icono_ausentismos2.png";
    } else if (opcion=="Procesar ausentismos") {
      return "assets/images/icono_ausentismos3.png";
    } else if (opcion=="Ausentismos procesados"){
      return "assets/images/icono_ausentismos4.png";
    } else {
      return "assets/images/reporte.png";
    }
 }
}
