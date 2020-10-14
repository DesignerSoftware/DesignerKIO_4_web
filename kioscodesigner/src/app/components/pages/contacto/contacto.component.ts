import { Component, OnInit } from '@angular/core';
import { KiopersonalizacionesService } from 'src/app/services/kiopersonalizaciones.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {
  datosContacto;

  constructor(private kioPersonalizaciones: KiopersonalizacionesService, private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.kioPersonalizaciones.getDatosContacto(this.usuarioService.empresa)
    .subscribe(
      data => {
        this.datosContacto = data;
      }
    );
  }

}
