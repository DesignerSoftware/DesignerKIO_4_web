import { Component, OnInit } from '@angular/core';
import { AusentismosService } from 'src/app/services/ausentismos.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-ausentismos-procesados',
  templateUrl: './ausentismos-procesados.component.html',
  styleUrls: ['./ausentismos-procesados.component.css']
})
export class AusentismosProcesadosComponent implements OnInit {
  solicitudesProcesadas = null;
  solicitudSeleccionada = null;
  public p8: number = 1;
  public dataFilt: any = "";

  constructor(private ausentismosService: AusentismosService, private usuarioService: UsuarioService) { 

    if (this.usuarioService.documento == null || this.usuarioService.documento.lenght === 0) {
      this.usuarioService.getDocumentoSeudonimo(this.usuarioService.usuario, this.usuarioService.empresa, this.usuarioService.cadenaConexion)
      .subscribe(
        data => {
          //console.log(data['result']);
          this.usuarioService.documento = data['result'];
          //console.log('ng OnInit:', this.usuarioService.documento);
          this.obtenerSolicitudes();
        }
      );
    } else {
      this.obtenerSolicitudes();
    }
  };

  ngOnInit() {
  }

  obtenerSolicitudes(){
    this.ausentismosService.getSolicitudesXEmpleadoJefe(this.usuarioService.usuario, this.usuarioService.empresa, this.usuarioService.cadenaConexion)
    .subscribe(
      data => {
        this.solicitudesProcesadas = data;
        console.log('ausentismos', this.solicitudesProcesadas);
      }
    );
  }
  

  detalleSolicitud(tipoSolicitud: string, index: string) {
    this.solicitudSeleccionada = this.solicitudesProcesadas[index];
    /*this.tipoSolicitudSeleccionada = tipoSolicitud;
    this.indexSolicitudSeleccionada = index;
    //console.log('tipoSolicitud: ' + tipoSolicitud);
    //console.log('index seleccionado: ' + index);
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

    }*/
    $('#staticBackdrop3').modal('show');
  }

}
