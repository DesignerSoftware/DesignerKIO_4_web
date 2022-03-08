import { Component, OnInit, ViewChild } from '@angular/core';
import { VacacionesService } from 'src/app/services/vacaciones.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { RecursosHumanosService } from 'src/app/services/recursoshumanos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consultar-mensaje',
  templateUrl: './consultar-mensaje.component.html',
  styleUrls: ['./consultar-mensaje.component.css']
})
export class ConsultarMensajeComponent implements OnInit {

  mensajeCosulatdos = null;
  public dataFilt: any = "";
  public p: number = 1;
  solicitudes = null;
  anexo = null;
  estadoSolicitudSeleccionada = null;
  mensajeSeleccionado = null;

  constructor(
    private vacacionesService: VacacionesService,
    private usuarioService: UsuarioService,
    private router : Router,
    private recursosHumanosService: RecursosHumanosService, 
    private cadenasKioskos: CadenaskioskosappService
  ) {

  }

  ngOnInit() {
    if (this.usuarioService.cadenaConexion) {
      this.cargarDatosIniciales();
    } else {
      this.getInfoUsuario();
    }    
  }

  getInfoUsuario() { // obtener la información del usuario del localStorage y guardarla en el service
    const sesion = this.usuarioService.getUserLoggedIn();
    this.usuarioService.setUsuario(sesion['usuario']);
    this.usuarioService.setEmpresa(sesion['empresa']);
    this.usuarioService.setTokenJWT(sesion['JWT']);
    this.usuarioService.setGrupo(sesion['grupo']);
    this.usuarioService.setUrlKiosco(sesion['urlKiosco']);
    //console.log('usuario: ' + this.usuarioService.usuario + ' empresa: ' + this.usuarioService.empresa);
    this.cadenasKioskos.getCadenasKioskosEmp(sesion['grupo'], this.usuarioService.urlKioscoDomain)
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

  cargarDatosIniciales() {
    if (
      this.usuarioService.documento == null ||
      this.usuarioService.documento.lenght === 0
    ) {
      this.usuarioService
        .getDocumentoSeudonimo(
          this.usuarioService.usuario,
          this.usuarioService.empresa,
          this.usuarioService.cadenaConexion
        )
        .subscribe((data) => {
          //console.log(data["result"]);
          this.usuarioService.documento = data["result"];
          //console.log("ng OnInit:", this.usuarioService.documento);
          this.consultarSolici();
        });
    } else {
      this.consultarSolici();
    }
  }

  consultarSolici() {
    this.getSolicitudes();
  }

  
  getSolicitudes() {
    this.recursosHumanosService
      .getMensajes(
        this.usuarioService.empresa,
        this.usuarioService.cadenaConexion
      )
      .subscribe((data) => {
        //console.log(data);
        this.mensajeCosulatdos = data;
      });
  }

  detalleSolicitud(index: string) {
    //console.log("index seleccionado: " + index);
    this.mensajeSeleccionado = this.mensajeCosulatdos[index]
    $("#staticBackdrop2").modal("show");
    document.getElementById('staticBackdrop2').style.display = 'block';
  }
  
  reloadPage() {
    //this.ngOnInit();
    this.router.navigate(['/recursoshumanos']);
  }

}
