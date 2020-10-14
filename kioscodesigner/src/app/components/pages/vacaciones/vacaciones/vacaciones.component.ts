import { Component, OnInit } from '@angular/core';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VacacionesService } from 'src/app/services/vacaciones.service';
import { Router } from '@angular/router';

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

  constructor(private opcionesKioskosServicio: OpcionesKioskosService, private usuarioServicio: UsuarioService, private router: Router, public vacacionesService: VacacionesService
    ) {
    //this.opcioneskioskoG = this.opcionesKioskosServicio.getOpcionesKiosco(this.empresa);
    console.log(this.opcioneskioskoG);
    this.filtrarOpcionesReportes();
  }

  ngOnInit() {
    console.log('ngOnInit() vacaciones')
  }

  filtrarOpcionesReportes() {
    let opkTempo: any = [];
    if (this.vacacionesService.opcionesKiosco == null || this.vacacionesService.opcionesKiosco.length === 0 || this.vacacionesService.opcionesKiosco === []) {
      opkTempo = this.opcionesKioskosServicio
        .getOpcionesKiosco(this.usuarioServicio.empresa, this.usuarioServicio.usuario)
        .subscribe((data) => {
          console.log('opciones Consultadas', data);
          opkTempo = data;
          this.vacacionesService.opcionesKiosco = opkTempo.filter(
            (opcKio) => opcKio['CODIGO'] === '30'
          );
          // console.log('filter 1', this.opcionesReportes[0]['SUBOPCION']);
        });
    } else {
      /*opkTempo = this.opcionesKioskosServicio.opcionesKioskos;
      this.opcionesReportes = opkTempo.filter(
        (opcKio) => opcKio['CODIGO'] === '20'
      );
      console.log('filter 2', this.opcionesReportes[0]['SUBOPCION']);*/
    }
  }

  seleccionarReporte(index: number) {
    console.log('seleccionarReporte');
    console.log('opcionesActuales', this.vacacionesService.opcionesKiosco);
    console.log(index);
    //this.reporteSeleccionado = this.opcionesReportes[0]['SUBOPCION'][index];
    // this.router.navigateByUrl(`/reportes/${index}`);
    //this.codigoReporteSeleccionado = this.opcionesReportes[0]['SUBOPCION'][index]['CODIGO'];
    this.router.navigateByUrl(`/vacaciones/${this.vacacionesService.opcionesKiosco[0]['SUBOPCION'][index]['NOMBRERUTA']}`)
    console.log('opcionSeleccionada: ' +this.vacacionesService.opcionesKiosco[0]['SUBOPCION'][index]['NOMBRERUTA']);
  }

 redireccionarVacaciones(){
  this.router.navigateByUrl(`/vacaciones`)
 }


}