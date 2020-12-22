import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VacacionesService } from 'src/app/services/vacaciones.service';


@Component({
  selector: 'app-procesar-solici',
  templateUrl: './procesar-solici.component.html',
  styleUrls: ['./procesar-solici.component.css']
})
export class ProcesarSoliciComponent implements OnInit {
  
  solicitudSeleccionada = null;

  constructor(public vacacionesService: VacacionesService, private usuarioService: UsuarioService) {     
    this.cargarDatosSolicitudesProcesadas();

  }

  ngOnInit() {
  }

  cargarDatosSolicitudesProcesadas(){
      if (this.vacacionesService.SolicitudesJefe == null) {
        this.vacacionesService.getSoliciSinProcesarJefe(this.usuarioService.empresa, this.usuarioService.usuario, 'ENVIADO')
          .subscribe(
            data => {
              this.vacacionesService.SolicitudesJefe = data;
              console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', this.vacacionesService.SolicitudesJefe);
            }
          );
      }
    }
    detalleSolicitud(index: string) {
      this.solicitudSeleccionada = this.vacacionesService.SolicitudesJefe[index];
 
      $('#staticBackdrop3').modal('show');
    }

}
