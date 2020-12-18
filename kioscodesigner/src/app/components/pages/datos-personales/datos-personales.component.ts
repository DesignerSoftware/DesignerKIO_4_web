import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.css']
})
export class DatosPersonalesComponent implements OnInit {
  // datos = null;

  constructor(public usuarioServicio: UsuarioService) {
    this.cargarDatos();
    this.cargarDatosFamilias();
  }

  ngOnInit() {

  }

  cargarDatos() {
    if (this.usuarioServicio.datosPersonales == null) {
      this.usuarioServicio.getDatosUsuario(this.usuarioServicio.usuario, this.usuarioServicio.empresa)
        .subscribe(
          data => {
            this.usuarioServicio.datosPersonales = data;
            console.log('datos', this.usuarioServicio.datosPersonales);
          }
        );
    }
  }

  cargarDatosFamilias() {
    if (this.usuarioServicio.datosFamilia == null) {
      this.usuarioServicio.getDatosUsuarioFamilia(this.usuarioServicio.usuario, this.usuarioServicio.empresa)
        .subscribe(
          data => {
            this.usuarioServicio.datosFamilia = data;
            console.log('datosFam', this.usuarioServicio.datosFamilia);
          }
        );
    }
  }

  FactorRHp(n) {
    let resultado;
    if (n != 'N') { // true
      resultado = 'POSITIVO';
    } else {
      resultado = 'NEGATIVO';
    }
    return resultado;
  }

}
