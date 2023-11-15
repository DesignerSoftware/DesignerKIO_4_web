import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VacacionesService } from 'src/app/services/vacaciones.service';

@Component({
  selector: 'app-ver-solici-proc-persona',
  templateUrl: './ver-solici-proc-persona.component.html',
  styleUrls: ['./ver-solici-proc-persona.component.scss']
})
export class VerSoliciProcPersonaComponent implements OnInit {

  solicitudesProcesadas: any = null;
  solicitudSeleccionada: any = null;
  public p8: number = 1;
  public dataFilt: any;

  constructor(private vacacionesService: VacacionesService,
    private usuarioService: UsuarioService) {
    if (this.usuarioService.documento == null || this.usuarioService.documento.lenght === 0) {
      this.usuarioService.getDocumentoSeudonimo(this.usuarioService.usuario, this.usuarioService.empresa, this.usuarioService.cadenaConexion)
        .subscribe(
          (data: any) => {
            console.log(data['result']);
            this.usuarioService.documento = data['result'];
            console.log('ng OnInit:', this.usuarioService.documento);
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
    this.vacacionesService.getSolicitudesProcesadasXAutorizador(this.usuarioService.usuario, this.usuarioService.empresa, this.usuarioService.cadenaConexion)
      .subscribe(
        data => {
          this.solicitudesProcesadas = data;
          console.log(this.solicitudesProcesadas);
        }
      );

  }

  detalleSolicitud(index: number) {
    this.solicitudSeleccionada = this.solicitudesProcesadas[index];
    $('#staticBackdrop3').modal('show');
  }

}
