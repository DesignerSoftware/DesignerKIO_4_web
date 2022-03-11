import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecursosHumanosService } from 'src/app/services/recursoshumanos.service';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-notificaciones-mensaje',
  templateUrl: './notificaciones-mensaje.component.html',
  styleUrls: ['./notificaciones-mensaje.component.css']
})
export class NotificacionesMensajeComponent implements OnInit {

    fotoCargada = "";
  mensajeRh: any = [];
  //opciones: any = [];
  reporteSeleccionado = null;
  codigoReporteSeleccionado = null;

  constructor(private opcionesKioskosServicio: OpcionesKioskosService, public usuarioServicio: UsuarioService,
    private router: Router, public recursosHumanosService: RecursosHumanosService, private cadenasKioskos: CadenaskioskosappService
  ) {
    //this.opcioneskioskoG = this.opcionesKioskosServicio.getopciones(this.empresa);
    //console.log(this.opcioneskioskoG);
  }

  ngOnInit() {
    //console.log(this.usuarioServicio.cadenaConexion);
    if (this.usuarioServicio.cadenaConexion) {
      this.getMensajesRrHh();
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
    //console.log('usuario: ' + this.usuarioServicio.usuario + ' empresa: ' + this.usuarioServicio.empresa);
    this.cadenasKioskos.getCadenaKioskoXGrupoNit(sesion['grupo'],sesion['empresa'])
    .subscribe(
      data => {
        ////console.log('getInfoUsuario', data);
        ////console.log(sesion['grupo']);
        for (let i in data) {
          if (data[i][3] === sesion['grupo']) { // GRUPO
          const temp = data[i];
          //console.log('cadena: ', temp[4]) // CADENA
          this.usuarioServicio.cadenaConexion=temp[4];
          //console.log('pages CADENA: ', this.usuarioServicio.cadenaConexion)
          this.cargarDatosIniciales();
          }
        }
      }
    );
  }  

  cargarDatosIniciales(){
    this.getMensajesRrHh();
  } 

  getMensajesRrHh() {
    this.recursosHumanosService
      .getMensajes(
        this.usuarioServicio.empresa,
        this.usuarioServicio.cadenaConexion,
        'S'
      )
      .subscribe((data) => {
        //console.log('getMensajesRrHh', data);
        this.mensajeRh = data;
      });
  }


  
  //RRHH
  cargaFoto(numero: number) {
    let formatoCargado = this.mensajeRh[numero]['formato'];
    let fotoCargada = this.mensajeRh[numero]['nombreadjunto'];
    let url = this.usuarioServicio.getUrlws();
    if (formatoCargado == ".pdf") {
      fotoCargada = 'img_pdf.png'
    }
    let urltemp = `${url}rrhh/obtenerFotoMsj/${fotoCargada}?cadena=${this.usuarioServicio.cadenaConexion}&usuario=${this.usuarioServicio.usuario}&empresa=${this.usuarioServicio.empresa}`;
    //console.log('urltemp',urltemp);
    return urltemp;
  }
  descargarArchivo(numero: number) {
    //console.log("cadenaReporte: ", this.usuarioServicio.cadenaConexion);
    /*console.log(
      "this.usuarioServicio.secuenciaEmpleado: " +
        this.usuarioServicio.secuenciaEmpleado
    );*/
    swal.fire({
      title: "Descargando reporte, por favor espere...",
      onBeforeOpen: () => {
        swal.showLoading();
        //console.log("descargarReporte");
        this.recursosHumanosService
          .getAnexo(
            this.mensajeRh[numero]['nombreadjunto'],
            this.usuarioServicio.empresa,
            this.usuarioServicio.cadenaConexion
          )
          .subscribe(
            (res) => {
              //console.log("ejemplo 1 : ",res);
              swal.fire({
                icon: "success",
                title:
                  "Reporte generado exitosamente, se descargará en un momento",
                showConfirmButton: false,
                timer: 1500,
              });
              const newBlob = new Blob([res], { type: "application/pdf" });
              let fileUrl = window.URL.createObjectURL(newBlob); // add 290920

              //if (window.navigator && window.navigator.msSaveOrOpenBlob) { 290920
              //window.navigator.msSaveOrOpenBlob(newBlob);
              if (window.navigator.msSaveOrOpenBlob) {
                // add 290920
                window.navigator.msSaveOrOpenBlob(
                  newBlob,
                  fileUrl.split(":")[1] + ".pdf"
                );
              } else {
                window.open(fileUrl);
              }
              //return;
              ///}
              // For other browsers:
              // Create a link pointing to the ObjectURL containing the blob.
              const data = window.URL.createObjectURL(newBlob);
              const link = document.createElement("a");
              link.href = data;
              let f = new Date();
              link.download =
                //this.reporteServicio.reporteSeleccionado["nombreruta"] +
                this.mensajeRh[numero]['nombreadjunto'] +
                "_" +
                this.usuarioServicio.usuario +
                "_" +
                f.getTime() +
                ".pdf";
              // this is necessary as link.click() does not work on the latest firefox
              link.dispatchEvent(
                new MouseEvent("click", {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                })
              );

              setTimeout(function () {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
              }, 100);
            },
            (error) => {
              //console.log(error);
              swal.fire(
                "Se ha presentado un error",
                "Se presentó un error al generar el reporte, por favor intentelo de nuevo más tarde!",
                "info"
              );
            }
          );
      },
      allowOutsideClick: () => !swal.isLoading(),
    });
  }
}
