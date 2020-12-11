import { Component, OnInit } from '@angular/core';
import { VacacionesService } from 'src/app/services/vacaciones.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-ver-solici-empleados',
  templateUrl: './ver-solici-empleados.component.html',
  styleUrls: ['./ver-solici-empleados.component.css']
})
export class VerSoliciEmpleadosComponent implements OnInit {
solicitudesEnviadas = null;
public dataFilt: any = "";
public p: number = 1;
public p1: number = 1;
public p2: number = 1;
public p3: number = 1;
public p4: number = 1;
public p5: number = 1;
solicitudesAprobadas = null;
solicitudesRechazadas = null;
solicitudesLiquidadas = null;
solicitudesCanceladas = null;
tipoSolicitudSeleccionada;
indexSolicitudSeleccionada;
solicitudSeleccionada;

  constructor(private vacacionesService: VacacionesService, private usuarioService: UsuarioService) {

  }

  ngOnInit() {
    if (this.usuarioService.documento == null || this.usuarioService.documento.lenght === 0) {
      this.usuarioService.getDocumentoSeudonimo(this.usuarioService.usuario, this.usuarioService.empresa)
      .subscribe(
        data => {
          console.log(data['result']);
          this.usuarioService.documento = data['result'];
          console.log('ng OnInit:', this.usuarioService.documento);
          this.consultarSoliciXEstados();
        }
      );
    } else {
      this.consultarSoliciXEstados();
    }
  }

  consultarSoliciXEstados() {
    this.getSoliciEnviadas();
    this.getSoliciAprobadas();
    this.getSoliciRechazadas();
    this.getSoliciLiquidadas();
    this.getSoliciCanceladas();
  }

  detalleSolicitud(tipoSolicitud: string, index: string) {
    this.tipoSolicitudSeleccionada = tipoSolicitud;
    this.indexSolicitudSeleccionada = index;
    console.log('tipoSolicitud: ' + tipoSolicitud);
    console.log('index seleccionado: ' + index);
    switch(tipoSolicitud) {
      case 'ENVIADO': {
        this.solicitudSeleccionada = this.solicitudesEnviadas[index];
        break;
      }
      case 'APROBADO': {
        this.solicitudSeleccionada = this.solicitudesAprobadas[index];
        break;
      }
      case 'RECHAZADO': {
        this.solicitudSeleccionada = this.solicitudesRechazadas[index];
        break;
      }
      case 'LIQUIDADO': {
        this.solicitudSeleccionada = this.solicitudesLiquidadas[index];
        break;
      }
      case 'CANCELADO': {
        this.solicitudSeleccionada = this.solicitudesCanceladas[index];
        break;
      }
      /*default: {
        //this.solicitudSeleccionada = null;
      }*/
    }
    $('#staticBackdrop2').modal('show');
  }

  getSoliciEnviadas() {
    this.vacacionesService.getSolicitudesXEstado(this.usuarioService.documento, this.usuarioService.empresa, 'ENVIADO')
    .subscribe(
      data => {
        console.log("Datos iniciales");
        console.log(data);
        this.solicitudesEnviadas = data;
      }
    );
  }

  getSoliciAprobadas() {
    this.vacacionesService.getSolicitudesXEstado(this.usuarioService.documento, this.usuarioService.empresa, 'AUTORIZADO')
    .subscribe(
      data => {
        console.log(data);
        this.solicitudesAprobadas = data;
      }
    );
  }

  getSoliciRechazadas() {
    this.vacacionesService.getSolicitudesXEstado(this.usuarioService.documento, this.usuarioService.empresa, 'RECHAZADO')
    .subscribe(
      data => {
        console.log(data);
        this.solicitudesRechazadas = data;
      }
    );
  }

  getSoliciLiquidadas() {
    this.vacacionesService.getSolicitudesXEstado(this.usuarioService.documento, this.usuarioService.empresa, 'LIQUIDADO')
    .subscribe(
      data => {
        console.log(data);
        this.solicitudesLiquidadas = data;
      }
    );
  }

  getSoliciCanceladas() {
    this.vacacionesService.getSolicitudesXEstado(this.usuarioService.documento, this.usuarioService.empresa, 'CANCELADO')
    .subscribe(
      data => {
        console.log(data);
        this.solicitudesCanceladas = data;
      }
    );
  }


}
