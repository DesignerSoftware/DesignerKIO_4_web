import { Component, OnInit } from '@angular/core';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-info-estudios',
  templateUrl: './info-estudios.component.html',
  styleUrls: ['./info-estudios.component.css']
})
export class InfoEstudiosComponent implements OnInit {
 
  estudioSeleccionado = null;
  

  constructor(public usuarioServicio: UsuarioService, private cadenasKioskos: CadenaskioskosappService) { }

  ngOnInit() {
    if (this.usuarioServicio.cadenaConexion) {
      this.cargarDatosIniciales();
    } else {
      this.getInfoUsuario();
    } 
  }

  getInfoUsuario() { // obtener la información del usuario del localStorage y guardarla en el service
    const sesion = this.usuarioServicio.getUserLoggedIn();
    this.usuarioServicio.setUsuario(sesion['usuario']);
    this.usuarioServicio.setEmpresa(sesion['empresa']);
    this.usuarioServicio.setTokenJWT(sesion['JWT']);
    this.usuarioServicio.setGrupo(sesion['grupo']);
    this.usuarioServicio.setUrlKiosco(sesion['urlKiosco']);
    console.log('usuario: ' + this.usuarioServicio.usuario + ' empresa: ' + this.usuarioServicio.empresa);
    this.cadenasKioskos.getCadenasKioskosEmp(sesion['grupo'])
    .subscribe(
      data => {
        console.log('getInfoUsuario', data);
        console.log(sesion['grupo']);
        
        for (let i in data) {
          if (data[i][3] === sesion['grupo']) { // GRUPO
          const temp = data[i];
          console.log('cadena: ', temp[4]) // CADENA
          this.usuarioServicio.cadenaConexion=temp[4];
          console.log('pages CADENA: ', this.usuarioServicio.cadenaConexion)
          this.cargarDatosIniciales();
          }
        }
      }
    );
  }

  cargarDatosIniciales() {
    this.cargarDatosEstudios();
    this.cargarDatosEstudiosNoFormales();
  }



  cargarDatosEstudios() {
    if (this.usuarioServicio.datosEstudios == null) {
      this.usuarioServicio.getEducacionesFormales(this.usuarioServicio.usuario,  this.usuarioServicio.cadenaConexion, this.usuarioServicio.empresa)
        .subscribe(
          data => {
            this.usuarioServicio.datosEstudios = data;
            console.log('datosEstudios', this.usuarioServicio.datosEstudios);
          }
        );
    }
  }

  cargarDatosEstudiosNoFormales() {
    if (this.usuarioServicio.datosEstudiosNF == null) {
      this.usuarioServicio.getEducacionesNoFormales(this.usuarioServicio.usuario,  this.usuarioServicio.cadenaConexion, this.usuarioServicio.empresa)
        .subscribe(
          data => {
            this.usuarioServicio.datosEstudiosNF = data;
            console.log('datosEstudiosNoFormales', this.usuarioServicio.datosEstudiosNF);
          }
        );
    }
  }
  
  

}
