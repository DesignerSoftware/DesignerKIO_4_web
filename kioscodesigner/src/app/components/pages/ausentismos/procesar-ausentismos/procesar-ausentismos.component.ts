import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AusentismosService } from 'src/app/services/ausentismos.service';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';
import swal from 'sweetalert2';
import { RespuestaSolicitud } from 'src/app/components/modelo/RespuestaSolicitud';
import { shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-procesar-ausentismos',
  templateUrl: './procesar-ausentismos.component.html',
  styleUrls: ['./procesar-ausentismos.component.scss']
})
export class ProcesarAusentismosComponent implements OnInit {

  formulario: FormGroup = this.fb.group({
    motivo: [''],
  });
  estadoNovEmple: any = null;
  msjNovEmple: string = '';
  solicitudSeleccionada: any = null;
  anexoSeleccionado: any = null;
  fotoPerfil: any;
  url: string = '/assets/images/fotos_empleados/sinFoto.jpg';
  public p1: number = 1;

  constructor(
    public usuarioServicio: UsuarioService,
    private cadenasKioskos: CadenaskioskosappService,
    private usuarioService: UsuarioService,
    private router: Router,
    public ausentismoService: AusentismosService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.getInfoUsuario();
    this.crearFormulario();
    this.cargarDatosSolicitudesProcesadas();
    shareReplay(1);
  }

  crearFormulario() {
    this.formulario = this.fb.group({
      motivo: [''],
    })
  }
  getInfoUsuario() {
    const sesion = this.usuarioServicio.getUserLoggedIn();
    this.usuarioServicio.setUsuario(sesion['usuario']);
    this.usuarioServicio.setEmpresa(sesion['empresa']);
    this.usuarioServicio.setTokenJWT(sesion['JWT']);
    this.usuarioServicio.setGrupo(sesion['grupo']);
    this.usuarioServicio.setUrlKiosco(sesion['urlKiosco']);
    this.cadenasKioskos.getCadenaKioskoXGrupoNit(sesion['grupo'], sesion['empresa'])
      .subscribe(
        (data: any) => {
          for (let i in data) {
            if (data[i][3] === sesion['grupo']) { // GRUPO
              const temp = data[i];
              this.usuarioServicio.cadenaConexion = temp[4];
              this.cargarDatosIniciales();
            }
          }
        }
      );
  }
  cargarDatosIniciales() {
    this.cargarDatosSolicitudesProcesadas();
  }


  cargarDatosSolicitudesProcesadas() {
    if (this.ausentismoService.SolicitudesJefe == null) {
      this.ausentismoService.getSoliciAusentSinProcesarJefe(this.usuarioService.empresa, this.usuarioService.usuario, 'ENVIADO', this.usuarioService.cadenaConexion)
        .subscribe(
          (data: any) => {
            this.ausentismoService.SolicitudesJefe = data;
          }
        );
    }
  }

  validaFechaNovedadEmpleadoXJefe(seudonimo: string, fecha: string) {
    this.ausentismoService.getvalidaFechaNovedadEmpleadoXJefe(this.usuarioService.empresa, seudonimo, fecha, this.usuarioService.cadenaConexion)
      .subscribe(
        (data: any) => {
          console.log(data);
          this.estadoNovEmple = data['valida'];
          if (this.estadoNovEmple == 'SA') {
            this.msjNovEmple = 'La fecha de ausentismo coincide con otra novedad de ausentismo';
          } else if (this.estadoNovEmple == 'SV') {
            this.msjNovEmple = 'La fecha de ausentismo coincide con una novedad de vacaciones';
          } else {
            this.msjNovEmple = '';
          }
          ;
        }
      );
  }

  detalleSolicitud(index: number) {
    if (Array.isArray(this.ausentismoService.SolicitudesJefe)) {
      this.solicitudSeleccionada = this.ausentismoService.SolicitudesJefe[index];
      this.anexoSeleccionado = this.ausentismoService.SolicitudesJefe[index][21];
      this.validaFechaNovedadEmpleadoXJefe(this.ausentismoService.SolicitudesJefe[index][22], this.ausentismoService.SolicitudesJefe[index][4]);
    }
  }

  navigate() {
    this.router.navigate(['/ausentismos']);
  }

  cargaFoto(documento: string) {
    this.fotoPerfil = documento;

    this.url = `${environment.urlKioskoReportes}conexioneskioskos/obtenerFotoPerfil?cadena=${this.usuarioService.cadenaConexion}&usuario=${this.fotoPerfil}&nit=${this.usuarioService.empresa}`;

    return this.url;
  }

  aprobarEnvio() {
    console.log('Motivo: ' + this.formulario.get('motivo')!.value);
    let aprobado;
    swal.fire({
      title: '¿Desea aprobar la solicitud?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aprobar',
      cancelButtonText: 'Cerrar'
    }).then((result) => {
      if (result.isConfirmed) {
        // informa que la solicitud ya tiene novedades de nomina en ese rango de fechas 
        if (this.estadoNovEmple == 'SV') {
          swal.fire({
            title: this.msjNovEmple,
            text: '¿Desea continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
          }).then((result) => {
            if (result.isConfirmed) {
              swal.fire({
                title: "Procesando solicitud, por favor espere...",
                willOpen: () => {
                  swal.showLoading();
                  this.ausentismoService.setNuevoEstadoSolicio(
                    this.usuarioService.usuario,
                    this.usuarioService.empresa,
                    this.usuarioService.cadenaConexion,
                    'AUTORIZADO',
                    this.solicitudSeleccionada[4],
                    this.solicitudSeleccionada[20],
                    '',
                    this.usuarioService.urlKioscoDomain,
                    this.usuarioService.grupoEmpresarial)
                    .subscribe(
                      (data) => {
                        console.log(data);
                        let dj: RespuestaSolicitud = JSON.parse(JSON.stringify(data)) as RespuestaSolicitud;
                        console.log('dj-SV');
                        console.log(dj);
                        //if (data) {
                        if (dj.solicitud === 'procesada' && dj.correo === 'enviado') {
                          swal
                            .fire({
                              icon: "success",
                              title:
                                "¡La solicitud de ausentismo ha sido autorizada exitosamente!",
                              showConfirmButton: true,
                            })
                            .then((res) => {
                              $("#exampleModalCenter").modal("hide");
                              this.cargarNotificaciones();
                              this.reloadPage();

                            });
                        } else if (dj.solicitud === 'procesada' && dj.correo === 'error') {
                          swal
                            .fire({
                              icon: "warning",
                              title:
                                "¡La solicitud de ausentismo ha sido autorizada exitosamente, pero el correo no se envió! " + dj.excepcion,
                              showConfirmButton: true,
                            })
                            .then((res) => {
                              $("#exampleModalCenter").modal("hide");
                              this.cargarNotificaciones();
                              this.reloadPage();

                            });
                        } else {
                          console.log(data);
                          swal
                            .fire({
                              icon: "error",
                              title: "Ha ocurrido un error al autorizar la solicitud",
                              text:
                                "Por favor inténtelo de nuevo más tarde. Si el error persiste contáctese con el área de nómina y recursos humanos de su empresa.",
                              showConfirmButton: true,
                            })
                            .then((res) => {
                              $("#exampleModalCenter").modal("hide");
                              this.reloadPage();
                            });
                        }
                      },
                      (error) => {
                        swal.fire({
                          icon: "error",
                          title: "Ha ocurrido un error al autorizar la solicitud",
                          text:
                            "Por favor inténtelo de nuevo más tarde. Si el error persiste contáctese con el área de nómina y recursos humanos de su empresa.",
                          showConfirmButton: true,
                        })
                          .then((res) => {
                            console.log(res);
                            $("#exampleModalCenter").modal("hide");
                            this.cargarNotificaciones();
                            this.reloadPage();
                          });
                      }
                    );
                },
                allowOutsideClick: () => !swal.isLoading(),
              });
            }
          });

        } else {
          swal.fire({
            title: "Procesando solicitud, por favor espere...",
            willOpen: () => {
              swal.showLoading();
              this.ausentismoService.setNuevoEstadoSolicio(
                this.usuarioService.usuario,
                this.usuarioService.empresa,
                this.usuarioService.cadenaConexion,
                'AUTORIZADO',
                this.solicitudSeleccionada[4],
                this.solicitudSeleccionada[20],
                '',
                this.usuarioService.urlKioscoDomain,
                this.usuarioService.grupoEmpresarial)
                .subscribe(
                  (data) => {
                    console.log(data);
                    let dj: RespuestaSolicitud = JSON.parse(JSON.stringify(data)) as RespuestaSolicitud;
                    console.log('dj');
                    console.log(dj);
                    //if (data) {
                    if (dj.solicitud === 'procesada' && dj.correo === 'enviado') {
                      swal
                        .fire({
                          icon: "success",
                          title:
                            "¡La solicitud de ausentismo ha sido autorizada exitosamente!",
                          showConfirmButton: true,
                        })
                        .then((res) => {
                          $("#exampleModalCenter").modal("hide");
                          this.cargarNotificaciones();
                          this.reloadPage();
                        });
                    } else if (dj.solicitud === 'procesada' && dj.correo === 'error') {
                      swal
                        .fire({
                          icon: "warning",
                          title:
                            "¡La solicitud de ausentismo ha sido autorizada exitosamente, pero el correo no se envió! " + dj.excepcion,
                          showConfirmButton: true,
                        })
                        .then((res) => {
                          $("#exampleModalCenter").modal("hide");
                          this.cargarNotificaciones();
                          this.reloadPage();
                        });
                    } else {
                      console.log(data);
                      swal
                        .fire({
                          icon: "error",
                          title: "Ha ocurrido un error al autorizar la solicitud",
                          text:
                            "Por favor inténtelo de nuevo más tarde. Si el error persiste contáctese con el área de nómina y recursos humanos de su empresa.",
                          showConfirmButton: true,
                        })
                        .then((res) => {
                          console.log(res);
                          $("#exampleModalCenter").modal("hide");
                          this.reloadPage();
                        });
                    }
                  },
                  (error) => {
                    swal
                      .fire({
                        icon: "error",
                        title: "Ha ocurrido un error al autorizar la solicitud",
                        text:
                          "Por favor inténtelo de nuevo más tarde. Si el error persiste contáctese con el área de nómina y recursos humanos de su empresa.",
                        showConfirmButton: true,
                      })
                      .then((res) => {
                        console.log(res);
                        $("#exampleModalCenter").modal("hide");
                        this.reloadPage();
                      });
                  }
                );
            },
            allowOutsideClick: () => !swal.isLoading(),
          });

        }
      }
    });

  }

  reloadPage() {
    this.ausentismoService.SolicitudesJefe = null;
    this.navigate();
  }

  rechazarEnvio() {
    let rechazado
    swal.fire({
      title: '¿Desea rechazar la solicitud?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Rechazar',
      cancelButtonText: 'Cerrar'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.formulario.get('motivo')!.value == '') {
          swal.fire({
            title: 'Por favor especifique el motivo por el que rechaza la solicitud',
            icon: 'warning',
            showConfirmButton: true
          });
        } else {
          swal.fire({
            title: "Enviando la solicitud al sistema, por favor espere...",
            willOpen: () => {
              swal.showLoading();
              this.ausentismoService
                .setNuevoEstadoSolicio(
                  this.usuarioService.usuario,
                  this.usuarioService.empresa,
                  this.usuarioService.cadenaConexion,
                  'RECHAZADO',
                  this.solicitudSeleccionada[4],
                  this.solicitudSeleccionada[20],
                  this.formulario.get('motivo')!.value,
                  this.usuarioService.urlKioscoDomain,
                  this.usuarioService.grupoEmpresarial
                )
                .subscribe(
                  (data) => {
                    console.log('solicitud rechazada:', data);
                    let dj: RespuestaSolicitud = JSON.parse(JSON.stringify(data)) as RespuestaSolicitud;
                    console.log('dj-rechazada');
                    console.log(dj);
                    //if (data) {
                    if (dj.solicitud === 'procesada' && dj.correo === 'enviado') {
                    swal
                        .fire({
                          icon: "success",
                          title:
                            "Solicitud de ausentismo rechazada exitosamente",
                          showConfirmButton: true,
                        })
                        .then((res) => {
                          $("#exampleModalCenter").modal("hide");
                          this.cargarNotificaciones();
                          this.reloadPage();
                        });
                    } else if (dj.solicitud === 'procesada' && dj.correo === 'error') {
                      swal
                          .fire({
                            icon: "warning",
                            title:
                              "¡Solicitud de ausentismo rechazada exitosamente, pero el correo no se envió!"+dj.excepcion,
                            showConfirmButton: true,
                          })
                          .then((res) => {
                            $("#exampleModalCenter").modal("hide");
                            this.cargarNotificaciones();
                            this.reloadPage();
                          });
                      } else {
                      swal
                        .fire({
                          icon: "error",
                          //title: data["mensaje"],
                          title: dj.excepcion,
                          showConfirmButton: true,
                        })
                        .then((res) => {
                          $("#exampleModalCenter").modal("hide");
                          this.reloadPage();
                        });
                    }
                  },
                  (error) => {
                    swal
                      .fire({
                        icon: "error",
                        title: "Ha ocurrido un error al rechazar la solicitud",
                        text:
                          "Por favor inténtelo de nuevo más tarde. Si el error persiste contáctese con el área de nómina y recursos humanos de su empresa.",
                        showConfirmButton: true,
                      })
                      .then((res) => {
                        $("#exampleModalCenter").modal("hide");
                        this.reloadPage();
                      });
                  }
                );
            },
            allowOutsideClick: () => !swal.isLoading(),
          });
        }


      }

    })
  }

  descargarArchivo() {
    console.log("cadenaReporte: ", this.usuarioServicio.cadenaConexion);
    console.log(
      "this.usuarioServicio.secuenciaEmpleado: " +
      this.usuarioServicio.secuenciaEmpleado
    );
    swal.fire({
      title: "Descargando reporte, por favor espere...",
      willOpen: () => {
        swal.showLoading();
        console.log("descargarReporte");
        this.ausentismoService
          .getAnexoAusentismo(
            this.anexoSeleccionado,
            this.usuarioServicio.empresa,
            this.usuarioServicio.cadenaConexion
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
                this.usuarioServicio.usuario +
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
  descargarArchivo1() {
    swal.fire({
      title: '¡Botón para descargar arhivos!',
      text: "",
      icon: 'warning'

    })
  }

  cargarNotificaciones() {
    this.usuarioService.loadAllNotifications();
  }

}
