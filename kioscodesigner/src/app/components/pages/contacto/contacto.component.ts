import { Component, OnInit } from '@angular/core';
import { KiopersonalizacionesService } from 'src/app/services/kiopersonalizaciones.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {

  constructor(private kioPersonalizaciones: KiopersonalizacionesService, public usuarioService: UsuarioService) { }

  ngOnInit() {
    this.consultarDatosContacto();
  }

  consultarDatosContacto() {
    if (this.usuarioService.datosContacto==null){
      this.kioPersonalizaciones.getDatosContacto(this.usuarioService.empresa, this.usuarioService.cadenaConexion)
      .subscribe(
        data => {
          this.usuarioService.datosContacto = data;
        }
      );
    }
  }

}
