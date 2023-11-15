import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CadenaskioskosappService } from './services/cadenaskioskosapp.service';
import { UsuarioService } from './services/usuario.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kioscodesigner';

  constructor(private usuarioServicio: UsuarioService, private cadenasKioskos: CadenaskioskosappService) {
    console.log('constructor AppComponent');
    //this.getInfoUsuario();
  }

  ngOnInit() {
  }

  // obtener la información del usuario del localStorage y guardarla en el service
  getInfoUsuario() {
    const sesion = this.usuarioServicio.getUserLoggedIn();
    this.usuarioServicio.setUsuario(sesion['usuario']);
    this.usuarioServicio.setEmpresa(sesion['empresa']);
    this.usuarioServicio.setTokenJWT(sesion['JWT']);
    this.usuarioServicio.setGrupo(sesion['grupo']);
    this.usuarioServicio.setUrlKiosco(sesion['urlKiosco']);
    this.cadenasKioskos.getCadenasKioskosEmp(sesion['grupo'], environment.urlKiosko)
      .subscribe(
        data => {
          if (Array.isArray(data)) {
            var val1 = Object.values(data);
            val1.forEach((v1) => {
              if (Array.isArray(v1)) {
                var val2 = Object.values(v1);
                if (val2[3] === sesion['grupo']) { // GRUPO
                  this.usuarioServicio.cadenaConexion = val2[4]; // CADENA
                }
              }
            });
          }
        }
      );
  }
}
