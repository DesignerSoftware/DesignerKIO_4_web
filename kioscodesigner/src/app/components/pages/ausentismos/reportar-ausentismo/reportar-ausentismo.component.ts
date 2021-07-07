import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-reportar-ausentismo',
  templateUrl: './reportar-ausentismo.component.html',
  styleUrls: ['./reportar-ausentismo.component.css']
})
export class ReportarAusentismoComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute, private usuarioService: UsuarioService, private cadenasKioskos: CadenaskioskosappService) { }
    formulario: FormGroup;

    ngOnInit() {
      this.crearFormulario();
      if (this.usuarioService.cadenaConexion) {
        this.cargarDatosIniciales();
      } else {
        this.getInfoUsuario();
      }
    }

    crearFormulario() {
      //console.log("crearFormulario()");
      this.formulario = this.fb.group({
        fechainicio: [, Validators.required],
        dias: [, Validators.required],
        fechafin: [, Validators.required],
        causa: [,Validators.required],
        codigo: [],
        clase: [],
        tipo: [],
        prorroga: [false]
      });
    }
  
    getInfoUsuario() { // obtener la información del usuario del localStorage y guardarla en el service
      const sesion = this.usuarioService.getUserLoggedIn();
      this.usuarioService.setUsuario(sesion['usuario']);
      this.usuarioService.setEmpresa(sesion['empresa']);
      this.usuarioService.setTokenJWT(sesion['JWT']);
      this.usuarioService.setGrupo(sesion['grupo']);
      this.usuarioService.setUrlKiosco(sesion['urlKiosco']);
      //console.log('usuario: ' + this.usuarioService.usuario + ' empresa: ' + this.usuarioService.empresa);
      this.cadenasKioskos.getCadenasKioskosEmp(sesion['grupo'])
      .subscribe(
        data => {
          //console.log('getInfoUsuario', data);
          //console.log(sesion['grupo']);
          for (let i in data) {
            if (data[i][3] === sesion['grupo']) { // GRUPO
            const temp = data[i];
            //console.log('cadena: ', temp[4]) // CADENA
            this.usuarioService.cadenaConexion=temp[4];
            //console.log('pages CADENA: ', this.usuarioService.cadenaConexion)
            this.cargarDatosIniciales();
            }
          }
        }
      );
    } 
  
    cargarDatosIniciales(){
    }    

    enviarNovedad(){

    }

}
