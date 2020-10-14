import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

import { StringMap } from '@angular/compiler/src/compiler_facade_interface';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.css']
})
export class DatosPersonalesComponent implements OnInit {
// datos = null;

  constructor(public usuarioServicio: UsuarioService) {
    //this.cargarDatos();
  }

  ngOnInit() {

  }

  // cargarDatos() {
  //   if (this.usuarioServicio.datosPersonales == null) {
  //     this.usuarioServicio.getDatosUsuario(this.usuarioServicio.usuario, this.usuarioServicio.empresa)
  //     .subscribe(
  //       data => {
  //         this.usuarioServicio.datosPersonales = data;
  //         console.log('datos', this.usuarioServicio.datosPersonales);
  //       }
  //     );
  //   }
  // }

}
