import { Component, OnInit } from '@angular/core';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  opcionesKioskos: any;
  public usuario: string = '';
  public empresa: string = '';


  constructor(private opcionesKioskosService: OpcionesKioskosService, public usuarioServicio: UsuarioService) {
    const sesion = this.usuarioServicio.getUserLoggedIn();
    console.log(sesion);
    this.usuario = sesion['usuario'];
    this.empresa = sesion['empresa'];
    this.cargarOpciones();
  }

  ngOnInit() {

  }

  cargarOpciones() {
    if (this.opcionesKioskosService.opcionesKioskos.length === 0 || this.opcionesKioskosService.opcionesKioskos == null
      || this.opcionesKioskosService.opcionesKioskos === []) {
      this.opcionesKioskosService.getOpcionesKiosco(this.empresa)
        .subscribe(
          data => {
            this.opcionesKioskos = data;
            this.opcionesKioskosService.opcionesKioskos = data;
            this.usuarioServicio.datos = data;
            console.log('opcionesKioskos', this.opcionesKioskos);
          });
    } else {
      this.opcionesKioskos = this.opcionesKioskosService.opcionesKioskos;
      console.log('opcionesKioskos', this.opcionesKioskos);
    }
  }

}
