import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { ReportesService } from 'src/app/services/reportes.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class DatosPersonalesComponent implements OnInit {

  fotoPerfil: any;
  url = 'assets/images/fotos_empleados/sinFoto.jpg';
  formulario: FormGroup = this.fb.group({
    mensaje: ["", Validators.required]
  });
  public dataFilt: any = "";
  public p1: number = 1;

  constructor(
    private fb: FormBuilder,
    public usuarioServicio: UsuarioService,
    private cadenasKioskos: CadenaskioskosappService,
    private opcionesKioskosServicio: OpcionesKioskosService,
    public reporteServicio: ReportesService) {
    this.crearFormulario();
  }

  ngOnInit() {
    if (this.usuarioServicio.cadenaConexion) {
      this.cargarDatosIniciales();
    } else {
      this.getInfoUsuario();
    }
  }

  cargarDatosIniciales() {
    this.cargarDatos();
    this.filtrarOpcionesReportes();
    this.cargarDatosFamilias();
    this.cargarTelefonosEmpleado();
    this.obtenerAnexosDocumentos();
    this.cargarNotificaciones();
  }

  // obtener la información del usuario del localStorage y guardarla en el service
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

  crearFormulario() {
    this.formulario = this.fb.group(
      {
        mensaje: ["", Validators.required]
      }
    );
  }

  cargarDatos() {
    if (this.usuarioServicio.datosPersonales == null) {
      this.usuarioServicio.getDatosUsuario(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
        .subscribe(
          (data: any) => {
            this.usuarioServicio.datosPersonales = data;
          }
        );
    }
  }

  cargarDatosFamilias() {
    if (this.usuarioServicio.datosFamilia == null) {
      this.usuarioServicio.getDatosUsuarioFamilia(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
        .subscribe(
          data => {
            this.usuarioServicio.datosFamilia = data;
          }
        );
    }
  }

  cargarTelefonosEmpleado() {
    if (this.usuarioServicio.telefonosEmpleado.length == 0) {
      let vacio: Array<string> = [''];
      this.usuarioServicio.getTelefonosEmpleado(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
        .subscribe(
          (data: any) => {
            if (data.length > 0) {
              this.usuarioServicio.telefonosEmpleado = data;
            } else {
              this.usuarioServicio.telefonosEmpleado.push(vacio[0]);
            }
          }
        );
    }
  }
  obtenerAnexosDocumentos() {
    this.usuarioServicio.getObtenerAnexosDocumentos(this.usuarioServicio.usuario, this.usuarioServicio.cadenaConexion, this.usuarioServicio.empresa)
      .subscribe(
        data => {
          this.usuarioServicio.documentosAnexos = data;
        }
      );
  }
  descargarAnexo(index: string) {
    this.usuarioServicio.getObtenerAnexosDocumentos(this.usuarioServicio.usuario, this.usuarioServicio.cadenaConexion, this.usuarioServicio.empresa)
      .subscribe(
        data => {
          this.usuarioServicio.documentosAnexos = data;
        }
      );
  }


  FactorRHp(n: string): string {
    //console.log('n', n);
    let resultado: string;
    if (n === null || n === 'null' || n === '') { 
      resultado = 'NO APLICA';
    } else if (n === 'P') {
      resultado = 'POSITIVO';
    } else {
      resultado = 'NEGATIVO';
    }
    return resultado;
  }

  filtrarOpcionesReportes() {
    let opkTempo: any = [];
    if (this.usuarioServicio.carnetSeleccionado.length === 0 || this.usuarioServicio.existeDocumentoAnexo.length === 0) {
      
      opkTempo = this.opcionesKioskosServicio.getOpcionesKiosco(
        this.usuarioServicio.empresa, this.usuarioServicio.usuario, 
        this.usuarioServicio.cadenaConexion
        ).subscribe((data: any) => {
          opkTempo = data;
          this.usuarioServicio.carnetSeleccionado = opkTempo.filter(
            (opcKio: any) => {
              if (opcKio.opcionkioskopadre && opcKio.opcionkioskopadre.codigo === '10' && opcKio.codigo === '13') {
                return true;
              } else {
                return false;
              }
            }
          );
          this.usuarioServicio.existeDocumentoAnexo = opkTempo.filter(
            (opcKio: any) => {
              if (opcKio.opcionkioskopadre && opcKio.opcionkioskopadre.codigo === '10' && opcKio.codigo === '14') {
                return true;
              } else {
                return false;
              }
            }
          );
        });
    }
    this.cargarFotoActual();
  }

  abrirModal() {
    $("#staticBackdrop").modal("show");
  }

  descargarDocumento(index: string) {
    this.usuarioServicio.documentoSeleccionado = index;
    swal.fire({
      title: "Descargando reporte, por favor espere...",
      willOpen: () => {
        swal.showLoading();
        this.usuarioServicio
          .getDescargarArchivo(
            this.usuarioServicio.usuario,
            this.usuarioServicio.cadenaConexion,
            this.usuarioServicio.empresa,
            this.usuarioServicio.documentoSeleccionado
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
              let nav = (window.navigator as any);
              if (nav.msSaveOrOpenBlob) {
                // add 290920
                nav.msSaveOrOpenBlob(
                  newBlob,
                  fileUrl.split(":")[1] + ".pdf"
                );
              } else {
                window.open(fileUrl);
              }

              //For other browsers:
              //Create a link pointing to the ObjectURL containing the blob.
              const data = window.URL.createObjectURL(newBlob);
              const link = document.createElement("a");
              link.href = data;
              let f = new Date();
              link.download =
                //this.reporteServicio.reporteSeleccionado["nombreruta"] +
                this.usuarioServicio.documentoSeleccionado +
                "_" +
                this.usuarioServicio.usuario +
                "_" +
                f.getTime() +
                ".pdf";
              //this is necessary as link.click() does not work on the latest firefox
              link.dispatchEvent(
                new MouseEvent("click", {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                })
              );

              setTimeout(function () {
                //For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
              }, 100);
            },
            (error: any) => {
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

  enviarReporteNovedad() {
    if (this.formulario.valid) {
      swal.fire({
        title: "Enviando mensaje al área de nómina y RRHH, por favor espere...",
        willOpen: () => {
          swal.showLoading();
          this.usuarioServicio.enviaCorreoNovedadRRHH(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.formulario.get('mensaje')!.value,
            'Solicitud para Corrección de Datos Personales', this.usuarioServicio.urlKioscoDomain, this.usuarioServicio.grupoEmpresarial, this.usuarioServicio.cadenaConexion)
            .subscribe(
              (data) => {
                if (data) {
                  swal
                    .fire({
                      icon: "success",
                      title:
                        "Mensaje enviado exitosamente al área de nómina y RRHH para su validación.",
                      showConfirmButton: true,
                    })
                    .then((res) => {
                      $("#staticBackdrop").modal("hide");
                      this.formulario.get('mensaje')!.setValue('');
                    });
                } else {
                  swal
                    .fire({
                      icon: "error",
                      title: "No fue posible enviar el correo",
                      text: 'Por favor inténtelo de nuevo más tarde.',
                      showConfirmButton: true,
                    })
                    .then((res) => {
                      $("#staticBackdrop").modal("hide");
                      this.formulario.get('mensaje')!.setValue('');
                    });
                }
              },
              (error) => {
                swal
                  .fire({
                    icon: "error",
                    title: "Hubo un error al enviar la petición",
                    text:
                      "Por favor inténtelo de nuevo más tarde. Si el error persiste contáctese con el área de nómina y recursos humanos de su empresa.",
                    showConfirmButton: true,
                  })
                  .then((res) => {
                    $("#staticBackdrop").modal("hide");
                    this.formulario.get('mensaje')!.setValue('');
                  });
              }
            );
        },
        allowOutsideClick: () => !swal.isLoading(),
      });

    } else {
      swal.fire({
        icon: "error",
        title: "No ha digitado la observación",
        text:
          "Por favor digite una observación sobre la información que se debe corregir en el sistema.",
        showConfirmButton: true
      })
    }
  }

  descargarCarnet() {
    this.cargarFotoActual();
    if (!this.usuarioServicio.existefotoPerfil) {
      swal
        .fire({
          icon: "error",
          title: "Por favor actualice su foto",
          text: "",
          showConfirmButton: true,
        })
    } else {
      swal.fire({
        title: "Generando carnet, por favor espere...",
        willOpen: () => {
          swal.showLoading();
          this.usuarioServicio.getGenerarQR(
            this.usuarioServicio.usuario,
            this.usuarioServicio.telefonosEmpleado[0][0],
            this.usuarioServicio.datosPersonales[0][12],
            this.usuarioServicio.datosPersonales[0][20],
            this.usuarioServicio.datosPersonales[0][17],
            this.usuarioServicio.cadenaConexion,
            this.usuarioServicio.empresa
          )
            .subscribe(
              (data: any) => {
                this.reporteServicio
                  .generarReporte(
                    this.usuarioServicio.carnetSeleccionado[0]["nombreruta"],
                    false,
                    this.usuarioServicio.correo,
                    this.usuarioServicio.carnetSeleccionado[0]["descripcion"],
                    this.usuarioServicio.carnetSeleccionado[0]["codigo"],
                    this.usuarioServicio.empresa,
                    this.usuarioServicio.cadenaConexion,
                    this.usuarioServicio.usuario,
                    this.usuarioServicio.grupoEmpresarial,
                    this.usuarioServicio.urlKioscoDomain
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

                      let nav = (window.navigator as any);
                      if (nav.msSaveOrOpenBlob) {
                        // add 290920
                        nav.msSaveOrOpenBlob(
                          newBlob,
                          fileUrl.split(":")[1] + ".pdf"
                        );
                      } else {
                        window.open(fileUrl);
                      }
                      // For other browsers:
                      // Create a link pointing to the ObjectURL containing the blob.
                      const data = window.URL.createObjectURL(newBlob);
                      const link = document.createElement("a");
                      link.href = data;
                      let f = new Date();
                      link.download =
                        fileUrl +
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
                      swal.fire(
                        "Se ha presentado un error",
                        "Se presentó un error al generar el reporte, por favor intentelo de nuevo más tarde!",
                        "info"
                      );
                    }
                  );
              },
              (error) => {
                swal
                  .fire({
                    icon: "error",
                    title: "Hubo un error al generar el carnet",
                    text:
                      "Por favor inténtelo de nuevo más tarde. Si el error persiste contáctese con el área de nómina y recursos humanos de su empresa.",
                    showConfirmButton: true,
                  })
                  .then((res) => {
                    $("#staticBackdrop").modal("hide");
                    this.formulario.get('mensaje')!.setValue('');
                  });
              }
            );
        },
        allowOutsideClick: () => !swal.isLoading(),
      });

    }

  }
  cargarFotoActual() {
    this.usuarioServicio.getValidaFoto(this.usuarioServicio.usuario, this.usuarioServicio.cadenaConexion, this.usuarioServicio.empresa)
      .subscribe(
        data => {
          this.usuarioServicio.existefotoPerfil = data;
        }
      );
  }
  cargarNotificaciones() {
    this.usuarioServicio.loadAllNotifications();
  }
  onPageChange(p_val: number){
    this.p1 = p_val;
  }
}
