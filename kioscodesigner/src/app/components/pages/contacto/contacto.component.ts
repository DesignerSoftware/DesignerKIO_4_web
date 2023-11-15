import { Component, OnInit } from '@angular/core';
import { KiopersonalizacionesService } from 'src/app/services/kiopersonalizaciones.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent implements OnInit {

  constructor(private kioPersonalizaciones: KiopersonalizacionesService,
    public usuarioService: UsuarioService) { }

  ngOnInit() {
    this.consultarDatosContacto();
    this.cargarNotificaciones();
  }

  consultarDatosContacto() {
    if (this.usuarioService.datosContacto == null) {
      this.kioPersonalizaciones.getDatosContacto(this.usuarioService.empresa, this.usuarioService.cadenaConexion)
        .subscribe(
          (data: any) => {
            this.usuarioService.datosContacto = data;
            this.usuarioService.nombreContactoSoporte = data[0][0];
            this.usuarioService.correoContactoSoporte = data[0][1];
          }
        );
    }
  }

  cargarNotificaciones() {
    this.usuarioService.loadAllNotifications();
  }

}
