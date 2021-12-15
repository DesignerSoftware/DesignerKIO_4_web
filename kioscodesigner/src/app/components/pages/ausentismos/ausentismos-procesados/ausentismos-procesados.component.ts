import { Component, OnInit } from '@angular/core';
import { AusentismosService } from 'src/app/services/ausentismos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-ausentismos-procesados',
  templateUrl: './ausentismos-procesados.component.html',
  styleUrls: ['./ausentismos-procesados.component.css']
})
export class AusentismosProcesadosComponent implements OnInit {
  solicitudesProcesadas = null;
  solicitudSeleccionada = null;
  anexoSeleccionado = null;
  public p8: number = 1;
  public dataFilt: any = "";

  constructor(private ausentismosService: AusentismosService, private usuarioService: UsuarioService) { 

    if (this.usuarioService.documento == null || this.usuarioService.documento.lenght === 0) {
      this.usuarioService.getDocumentoSeudonimo(this.usuarioService.usuario, this.usuarioService.empresa, this.usuarioService.cadenaConexion)
      .subscribe(
        data => {
          //console.log(data['result']);
          this.usuarioService.documento = data['result'];
          //console.log('ng OnInit:', this.usuarioService.documento);
          this.obtenerSolicitudes();
        }
      );
    } else {
      this.obtenerSolicitudes();
    }
  };

  ngOnInit() {
  }

  obtenerSolicitudes(){
    this.ausentismosService.getSolicitudesXEmpleadoJefe(this.usuarioService.usuario, this.usuarioService.empresa, this.usuarioService.cadenaConexion)
    .subscribe(
      data => {
        this.solicitudesProcesadas = data;
        //console.log('ausentismos', this.solicitudesProcesadas);
      }
    );
  }
  

  detalleSolicitud(tipoSolicitud: string, index: string) {
    this.solicitudSeleccionada = this.solicitudesProcesadas[index];
    this.anexoSeleccionado = this.solicitudesProcesadas[index][17];    
    /*this.tipoSolicitudSeleccionada = tipoSolicitud;
    this.indexSolicitudSeleccionada = index;
    //console.log('tipoSolicitud: ' + tipoSolicitud);
    //console.log('index seleccionado: ' + index);
    switch(tipoSolicitud) {
      case 'ENVIADO': {
        this.solicitudSeleccionada = this.solicitudesEnviadas[index];
        break;
      }
      case 'APROBADO': {
        this.solicitudSeleccionada = this.solicitudesAprobadas[index];
        break;
      }
      case 'RECHAZADO': {
        this.solicitudSeleccionada = this.solicitudesRechazadas[index];
        break;
      }
      case 'LIQUIDADO': {
        this.solicitudSeleccionada = this.solicitudesLiquidadas[index];
        break;
      }
      case 'CANCELADO': {
        this.solicitudSeleccionada = this.solicitudesCanceladas[index];
        break;
      }

    }*/
    $('#staticBackdrop3').modal('show');
  }
  descargarArchivo() {
    console.log("cadenaReporte: ", this.usuarioService.cadenaConexion);
    console.log(
      "this.usuarioServicio.secuenciaEmpleado: " +
        this.usuarioService.secuenciaEmpleado
    );
    swal.fire({
      title: "Descargando reporte, por favor espere...",
      onBeforeOpen: () => {
        swal.showLoading();
        console.log("descargarReporte");
        this.ausentismosService
          .getAnexoAusentismo(
            this.anexoSeleccionado,
            this.usuarioService.empresa,
            this.usuarioService.cadenaConexion
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
                this.anexoSeleccionado +
                "_" +
                this.usuarioService.usuario +
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
              console.log(error);
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
