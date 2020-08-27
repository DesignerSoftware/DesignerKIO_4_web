import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.css']
})
export class DatosPersonalesComponent implements OnInit {
usuario: string;
empresa: string;
datos = null;

  constructor(private usuarioServicio: UsuarioService) { 
    const sesion = this.usuarioServicio.getUserLoggedIn();
    console.log(sesion);
    this.usuario = sesion['usuario'];
    this.empresa = sesion['empresa'];
    this.cargarDatos();
  }

  ngOnInit() {
  }

  cargarDatos() {
    if (this.datos == null) {
      this.usuarioServicio.getDatosUsuario(this.usuario, this.empresa)
      .subscribe(
        data => {
          this.datos = data;
          console.log('datos', this.datos);
        }
      );
    }
  }

}
