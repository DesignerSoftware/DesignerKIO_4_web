import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VacacionesService } from 'src/app/services/vacaciones.service';

@Component({
  selector: 'app-soli-procesadas',
  templateUrl: './soli-procesadas.component.html',
  styleUrls: ['./soli-procesadas.component.scss']
})
export class SoliProcesadasComponent implements OnInit {
  solicitudesProcesadas: any = null;
  solicitudSeleccionada: any = null;
  solicitudesFiltradas: any = null;

  public p8: number = 0;
  _dataFilt: string = "";

  constructor(private vacacionesService: VacacionesService,
    private usuarioService: UsuarioService) {
    if (this.usuarioService.documento == null || this.usuarioService.documento.lenght === 0) {
      this.usuarioService.getDocumentoSeudonimo(this.usuarioService.usuario, this.usuarioService.empresa, this.usuarioService.cadenaConexion)
        .subscribe(
          (data: any) => {
            this.usuarioService.documento = data['result'];
            this.obtenerSolicitudes();
          }
        );
    } else {
      this.obtenerSolicitudes();
    }
  };

  ngOnInit() {
  }

  obtenerSolicitudes() {
    this.vacacionesService.getSolicitudesXEmpleadoJefe(this.usuarioService.usuario, this.usuarioService.empresa, this.usuarioService.cadenaConexion)
      .subscribe(
        (data: any) => {
          this.solicitudesProcesadas = data;
        }
      );

  }

  detalleSolicitud(tipoSolicitud: string, index: any) {
    this.solicitudSeleccionada = this.solicitudesProcesadas[index];
    $('#staticBackdrop3').modal('show');
  }

  get dataFilt(): string{
    return this._dataFilt;
  }

  set dataFilt(val: string){
    this._dataFilt = val;
    this.solicitudesProcesadas = this.filter(val, 1);
  }

  filter(v: string, t: number) {
    console.log('v: ', v);
    console.log('t: ', t);
    if (v === '') {
      switch (t) {
        case 1: {
          this.obtenerSolicitudes();
          break;
        }
        default: {
          break;
        }
      }
    }
    switch (t) {
      case 1: {
        this.solicitudesFiltradas = this.solicitudesProcesadas;
        break;
      }
      default: {
        this.solicitudesFiltradas = null;
        break;
      }
    }
    return this.solicitudesFiltradas.filter((x: any) => x[0]?.toString().toLowerCase().indexOf(v.toLowerCase()) !== -1
      || x[1]?.toString()?.toLowerCase().indexOf(v.toLowerCase()) !== -1
      || x[2]?.toString().toLowerCase().indexOf(v.toLowerCase()) !== -1
      || x[3]?.toString().toLowerCase().indexOf(v.toLowerCase()) !== -1
      || x[4]?.toString().toLowerCase().indexOf(v.toLowerCase()) !== -1
      //|| x[9]?.toString().toLowerCase().indexOf(v.toLowerCase()) !== -1
    );
  }

}
