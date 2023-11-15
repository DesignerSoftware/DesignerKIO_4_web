import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AusentismosService } from 'src/app/services/ausentismos.service';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VacacionesService } from 'src/app/services/vacaciones.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-ver-ausentismos-reportados',
  templateUrl: './ver-ausentismos-reportados.component.html',
  styleUrls: ['./ver-ausentismos-reportados.component.scss']
})
export class VerAusentismosReportadosComponent implements OnInit {

  solicitudSeleccionada: any;
  anexoSeleccionado: any;
  estadoSolicitudSeleccionada: any;
  solicitudesEnviadas: any;
  solicitudesLiquidadas: any;
  solicitudesCanceladas: any;
  solicitudesAprobadas: any;
  solicitudesRechazadas: any;
  tipoSolicitudSeleccionada: string = '';
  indexSolicitudSeleccionada: number = 0;
  public dataFilt: any = "";
  public p1: number = 1;
  public p2: number = 1;
  public p3: number = 1;
  public p4: number = 1;
  public p5: number = 1;

  constructor(
    //private vacacionesService: VacacionesService,
    private usuarioService: UsuarioService,
    private router: Router,
    private ausentismoService: AusentismosService,
    private cadenasKioskos: CadenaskioskosappService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    if (this.usuarioService.cadenaConexion) {
      this.cargarDatosIniciales();
    } else {
      this.getInfoUsuario();
    }

  }

  // obtener la información del usuario del localStorage y guardarla en el service
  getInfoUsuario() {
    const sesion = this.usuarioService.getUserLoggedIn();
    this.usuarioService.setUsuario(sesion['usuario']);
    this.usuarioService.setEmpresa(sesion['empresa']);
    this.usuarioService.setTokenJWT(sesion['JWT']);
    this.usuarioService.setGrupo(sesion['grupo']);
    this.usuarioService.setUrlKiosco(sesion['urlKiosco']);
    this.cadenasKioskos.getCadenaKioskoXGrupoNit(sesion['grupo'], sesion['empresa'])
      .subscribe(
        (data: any) => {
          for (let i in data) {
            if (data[i][3] === sesion['grupo']) { // GRUPO
              const temp = data[i];
              this.usuarioService.cadenaConexion = temp[4];
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
        .subscribe((data: any) => {
          this.usuarioService.documento = data["result"];
          this.consultarSoliciXEstados();
        });
    } else {
      this.consultarSoliciXEstados();
    }
  }

  consultarSoliciXEstados() {
    this.getSoliciEnviadas();
    this.getSoliciAprobadas();
    this.getSoliciRechazadas();
    this.getSoliciLiquidadas();
    this.getSoliciCanceladas();
  }

  getSoliciEnviadas() {
    this.ausentismoService
      .getSolicitudesXEstado(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        "ENVIADO", this.usuarioService.cadenaConexion
      )
      .subscribe((data: any) => {
        console.log("Datos iniciales");
        console.log(data);
        this.solicitudesEnviadas = data;
      });
  }

  getSoliciAprobadas() {
    this.ausentismoService
      .getSolicitudesXEstado(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        'AUTORIZADO', this.usuarioService.cadenaConexion
      )
      .subscribe((data: any) => {
        this.solicitudesAprobadas = data;
      });
  }

  getSoliciRechazadas() {
    this.ausentismoService
      .getSolicitudesXEstado(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        'RECHAZADO', this.usuarioService.cadenaConexion
      )
      .subscribe((data: any) => {
        this.solicitudesRechazadas = data;
      });
  }

  getSoliciLiquidadas() {
    this.ausentismoService
      .getSolicitudesXEstado(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        'LIQUIDADO', this.usuarioService.cadenaConexion
      )
      .subscribe((data: any) => {
        this.solicitudesLiquidadas = data;
      });
  }

  getSoliciCanceladas() {
    this.ausentismoService
      .getSolicitudesXEstado(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        'CANCELADO', this.usuarioService.cadenaConexion
      )
      .subscribe((data: any) => {
        this.solicitudesCanceladas = data;
      });
  }

  detalleSolicitud(tipoSolicitud: string, index: number) {
    this.tipoSolicitudSeleccionada = tipoSolicitud;
    this.indexSolicitudSeleccionada = index;
    this.estadoSolicitudSeleccionada = null;
    switch (tipoSolicitud) {
      case "ENVIADO": {
        this.solicitudSeleccionada = this.solicitudesEnviadas[index];
        this.anexoSeleccionado = this.solicitudesEnviadas[index][15];
        this.estadoSolicitudSeleccionada = this.solicitudesEnviadas[index][4];
        break;
      }
      case "APROBADO": {
        this.solicitudSeleccionada = this.solicitudesAprobadas[index];
        this.anexoSeleccionado = this.solicitudesAprobadas[index][15];
        this.estadoSolicitudSeleccionada = this.solicitudesAprobadas[index][4];
        break;
      }
      case "RECHAZADO": {
        this.solicitudSeleccionada = this.solicitudesRechazadas[index];
        this.anexoSeleccionado = this.solicitudesRechazadas[index][15];
        this.estadoSolicitudSeleccionada = this.solicitudesRechazadas[index][4];
        break;
      }
      case "LIQUIDADO": {
        this.solicitudSeleccionada = this.solicitudesLiquidadas[index];
        this.anexoSeleccionado = this.solicitudesLiquidadas[index][15];
        this.estadoSolicitudSeleccionada = this.solicitudesLiquidadas[index][4];
        break;
      }
      case "CANCELADO": {
        this.solicitudSeleccionada = this.solicitudesCanceladas[index];
        this.anexoSeleccionado = this.solicitudesCanceladas[index][15];
        this.estadoSolicitudSeleccionada = this.solicitudesCanceladas[index][4];
        break;
      }
    }
    $("#staticBackdrop2").modal("show");
    document.getElementById('staticBackdrop2')!.style.display = 'block';
  }

  detalleSolicitud2(tipoSolicitud: string, index: number) {
    this.tipoSolicitudSeleccionada = tipoSolicitud;
    this.indexSolicitudSeleccionada = index;
    switch (tipoSolicitud) {
      case "ENVIADO": {
        this.solicitudSeleccionada = this.solicitudesEnviadas[index];
        this.anexoSeleccionado = this.solicitudesEnviadas[index][15];
        this.estadoSolicitudSeleccionada = this.solicitudesEnviadas[index][4];
        break;
      }
    }
    console.log(this.estadoSolicitudSeleccionada);
    $("#staticBackdrop3").modal("show");
    $("#staticBackdrop2").modal("show");
    document.getElementById('staticBackdrop2')!.style.display = 'block';
  }

  cancelarEnvio() {
    let cancelado;
    swal.fire({
      title: "¿Está seguro que desea cancelar la novedad de ausentismo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Cancelar",
      cancelButtonText: "Cerrar",
    })
      .then((result) => {
        if (result.isConfirmed) {
          swal.fire({
            title: "Enviando la novedad al sistema, por favor espere...",
            willOpen: () => {
              swal.showLoading();
              this.ausentismoService
                .setNuevoEstadoSolicio(
                  this.usuarioService.usuario,
                  this.usuarioService.empresa,
                  this.usuarioService.cadenaConexion,
                  "CANCELADO",
                  this.solicitudSeleccionada[1],
                  this.solicitudSeleccionada[14],
                  '',
                  this.usuarioService.urlKioscoDomain,
                  this.usuarioService.grupoEmpresarial
                )
                .subscribe(
                  (data) => {
                    if (data) {
                      $('#staticBackdrop3').modal('hide');
                      swal
                        .fire({
                          icon: "success",
                          title:
                            "Reporte de ausentismo cancelado exitosamente",
                          showConfirmButton: true,
                        })
                        .then((res) => {
                          $("#staticBackdrop2").modal("hide");
                          this.router.navigate(["/ausentismos"]);
                        });
                    } else {
                      swal
                        .fire({
                          icon: "error",
                          title: 'Ha ocurrido un error al cancelar la solicitud.',
                          text: 'Por favor inténtelo de nuevo más tarde. Si el problema persiste contáctese con el área de nómina y recursos humanos de su empresa.',
                          showConfirmButton: true,
                        })
                        .then((res) => {
                          $("#staticBackdrop2").modal("hide");
                          this.reloadPage();
                        });
                    }
                  },
                  (error) => {
                    swal
                      .fire({
                        icon: 'error',
                        title: 'Ha ocurrido un error al reportar la novedad',
                        text:
                          'Por favor inténtelo de nuevo más tarde. Si el error persiste contáctese con el área de nómina y recursos humanos de su empresa.',
                        showConfirmButton: true,
                      })
                      .then((res) => {
                        $("#staticBackdrop2").modal("hide");
                        this.reloadPage();
                      });
                  }
                );
            },
            allowOutsideClick: () => !swal.isLoading(),
          });

        }
      });
  }
  descargarArchivo() {
    console.log("cadenaReporte: ", this.usuarioService.cadenaConexion);
    console.log(
      "this.usuarioService.secuenciaEmpleado: " +
      this.usuarioService.secuenciaEmpleado
    );
    swal.fire({
      title: "Descargando documento, por favor espere...",
      willOpen: () => {
        swal.showLoading();
        console.log("descargarReporte");
        this.ausentismoService
          .getAnexoAusentismo(
            this.anexoSeleccionado,
            this.usuarioService.empresa,
            this.usuarioService.cadenaConexion
          )
          .subscribe(
            (res) => {
              console.log("ejemplo 1 : ", res);
              swal.fire({
                icon: "success",
                title:
                  "Reporte generado exitosamente, se descargará en un momento",
                showConfirmButton: false,
                timer: 1500,
              });
              const newBlob = new Blob([res], { type: "application/pdf" });
              // add 200929
              let fileUrl = window.URL.createObjectURL(newBlob);
              let fileUrlSS = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
              // For other browsers:
              // Create a link pointing to the ObjectURL containing the blob.
              const link = document.createElement("a");
              link.href = fileUrl;
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
                window.URL.revokeObjectURL(fileUrl);
              }, 100);
            },
            (error: any) => {
              console.log(error);
              swal.fire(
                "Se ha presentado un error",
                "Se presentó un error al descargar el documento, por favor intentelo de nuevo más tarde!",
                "info"
              );
            }
          );
      },
      allowOutsideClick: () => !swal.isLoading(),
    });
  }

  reloadPage() {
    this.router.navigate(['/ausentismos']);
  }

}
