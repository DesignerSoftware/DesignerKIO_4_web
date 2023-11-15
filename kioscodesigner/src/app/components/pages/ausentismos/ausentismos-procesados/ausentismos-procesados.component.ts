import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AusentismosService } from 'src/app/services/ausentismos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-ausentismos-procesados',
  templateUrl: './ausentismos-procesados.component.html',
  styleUrls: ['./ausentismos-procesados.component.scss']
})
export class AusentismosProcesadosComponent implements OnInit {

  solicitudesProcesadas: any = null;
  solicitudSeleccionada: any = null;
  anexoSeleccionado: any = null;
  public p8: number = 1;
  public dataFilt: any = "";

  constructor(private ausentismosService: AusentismosService,
    private usuarioService: UsuarioService,
    private sanitizer: DomSanitizer) {

    if (this.usuarioService.documento == null || this.usuarioService.documento.lenght === 0) {
      this.usuarioService.getDocumentoSeudonimo(this.usuarioService.usuario, this.usuarioService.empresa, this.usuarioService.cadenaConexion)
        .subscribe(
          (data: any) => {
            this.usuarioService.documento = data['result'];
            this.obtenerSolicitudes();
          }
        );
    } else {
      this.obtenerSolicitudes();
    }
  };

  ngOnInit(): void {
  }

  obtenerSolicitudes() {
    this.ausentismosService.getSolicitudesXEmpleadoJefe(this.usuarioService.usuario, this.usuarioService.empresa, this.usuarioService.cadenaConexion)
      .subscribe(
        (data: any) => {
          this.solicitudesProcesadas = data;
        }
      );
  }

  detalleSolicitud(tipoSolicitud: string, index: number) {
    this.solicitudSeleccionada = this.solicitudesProcesadas[index];
    this.anexoSeleccionado = this.solicitudesProcesadas[index][17];
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
      willOpen: () => {
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
              swal.fire({
                icon: "success",
                title:
                  "Reporte generado exitosamente, se descargará en un momento",
                showConfirmButton: false,
                timer: 1500,
              });
              const newBlob = new Blob([res], { type: "application/pdf" });
              let fileUrl = window.URL.createObjectURL(newBlob); // add 290920
              let fileUrlSS = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
              const link = document.createElement("a");
              link.href = fileUrl;
              let f = new Date();
              link.download =
                this.anexoSeleccionado +
                "_" +
                this.usuarioService.usuario +
                "_" +
                f.getTime() +
                ".pdf";
              link.dispatchEvent(
                new MouseEvent("click", {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                })
              );

              setTimeout(function () {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(fileUrl);
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
