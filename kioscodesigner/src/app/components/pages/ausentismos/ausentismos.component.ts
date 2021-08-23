import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { data } from 'jquery';
import { AusentismosService } from 'src/app/services/ausentismos.service';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-ausentismos',
  templateUrl: './ausentismos.component.html',
  styleUrls: ['./ausentismos.component.css']
})
export class AusentismosComponent implements OnInit {
  opcioneskioskoG: any = [];
  private usuario: string;
  private empresa: string;
  //opciones: any = [];
  reporteSeleccionado = null;
  codigoReporteSeleccionado = null;

  constructor(private opcionesKioskosServicio: OpcionesKioskosService, private usuarioServicio: UsuarioService,
    private router: Router, public ausentismosService: AusentismosService, private cadenasKioskos: CadenaskioskosappService
  ) {
    //this.opcioneskioskoG = this.opcionesKioskosServicio.getopciones(this.empresa);
    //console.log(this.opcioneskioskoG);
  }

  ngOnInit() {
    this.ausentismosService.pruebaToken('orueba')
    //.subscribe(
      //data =>{
        /*if (typeof data === 'object')
        console.log('es objeto');
        //console.log(JSON.parse(data.toString()));
        //console.log(JSON.stringify(data));
        //console.log(JSON.stringify(resp));

        /*try {
            console.log(JSON.parse(JSON.stringify(resp)));
        } catch(e ){
          console.log(e);
        }*/
        
      //}
      //console.log(JSON.stringify(data));
      /*(response: Response) =>{
        console.log('status', response.status);
        if (response.status==200)
        console.log('text', response.text);
        else
        console.log('si hubo un error');
      }*/     
       //}
    .pipe(
    );
    console.log('prueba')
    console.log(this.ausentismosService.pruebaToken('orueba').subscribe()); 
      //console.log('ngOnInit() ausentismos');
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
    this.filtrarOpcionesReportes();
    this.getOpcionesDiagnosticos();
  }  

  getOpcionesDiagnosticos(){
    if (!this.ausentismosService.codigosAusentismos || this.ausentismosService.codigosAusentismos!=null){
      this.ausentismosService.getCodigosAusentismos(this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
      .subscribe(
        data=> {
          this.ausentismosService.codigosAusentismos = data;
          console.log(data);
        }
      )
    }
  }

  filtrarOpcionesReportes() {
    let opkTempo: any = [];
    if (this.ausentismosService.opciones == null || this.ausentismosService.opciones.length === 0 || this.ausentismosService.opciones === []) {
      opkTempo = this.opcionesKioskosServicio
        .getOpcionesKiosco(this.usuarioServicio.empresa, this.usuarioServicio.usuario, this.usuarioServicio.cadenaConexion)
        .subscribe((data) => {
          //console.log('opciones Consultadas', data);
          opkTempo = data;
          this.ausentismosService.opciones = opkTempo.filter(
            //(opcKio) => opcKio['opcionkioskopadre']['codigo'] === '30'
            (opcKio) => {
              if (opcKio.opcionkioskopadre && opcKio.opcionkioskopadre.codigo==='40'){
                return true;
              }
            }
          );
          //this.vacacionesService.opciones = opkTempo;
          // //console.log('filter 1', this.opcionesReportes[0]['SUBOPCION']);
           //console.log('filter 1', this.ausentismosService.opciones);
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
    //console.log('opcionesActuales', this.ausentismosService.opciones);
    //console.log(index);
    //this.reporteSeleccionado = this.opcionesReportes[0]['SUBOPCION'][index];
    // this.router.navigateByUrl(`/reportes/${index}`);
    //this.codigoReporteSeleccionado = this.opcionesReportes[0]['SUBOPCION'][index]['CODIGO'];
    this.router.navigateByUrl(`/ausentismos/${this.ausentismosService.opciones[index]['nombreruta']}`)
    //console.log('opcionSeleccionada: ' +this.ausentismosService.opciones[index]['nombreruta']);
  }

 redireccionarVacaciones(){
  this.router.navigateByUrl(`/ausentismos`)
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
