import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { ReportesService } from 'src/app/services/reportes.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {

  formulario: FormGroup = {} as FormGroup;
  fechaDesdeCal: Date = new Date();
  fechaHastaCal: Date = new Date();
  enviocorreo: boolean = false;
  dirigidoa: string = '';
  correo: string = '';
  anocir: number = 0;
  ano: string = '';
  nombreRuta: string = '';
  fechadesde: string = '';
  fechahasta: string = '';
  year: string = '';

  constructor(
    public opcionesKioskosServicio: OpcionesKioskosService,
    private router: Router,
    private fb: FormBuilder,
    public usuarioServicio: UsuarioService,
    public reporteServicio: ReportesService,
    private cadenasKioskos: CadenaskioskosappService,
    public datepipe: DatePipe
  ) {
    this.crearFormulario();
    this.reporteServicio.reporteSeleccionado = null;

  }

  ngOnInit() {
    if (this.usuarioServicio.cadenaConexion) {
      this.cargarDatosIniciales();
    } else {
      this.getInfoUsuario();
    }
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
    this.filtrarOpcionesReportes();
    this.consultarParametrosReportes();
    this.getCorreoConexioneskioskos();
    this.cargarNotificaciones();
  }

  conviertefecha(fecharecibidatexto: string) {
    let fec = fecharecibidatexto;

    let anio = fec.substring(0, 4);
    let mes = fec.substring(500, 7);
    let dia = fec.substring(8, 10);

    let ensamble = dia + "-" + mes + "-" + anio;
    let fecha = new Date(ensamble).toLocaleDateString("es-CO");
    return fecha;
  }

  crearFormulario() {
    this.formulario = this.fb.group({
      fechadesde: [, Validators.required],
      fechahasta: [, Validators.required],
      anoCIR: [,],
      enviocorreo: [false],
      dirigidoa: [],
    });
  }

  consultarParametrosReportes() {
    this.usuarioServicio
      .getParametros(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
      .subscribe((data: any) => {
        this.fechaDesdeCal = data[0][0];
        this.fechaHastaCal = data[0][1];
        this.enviocorreo = data[0][2];
        this.dirigidoa = data[0][3] || '';
        this.formulario.get("fechadesde")!.setValue(this.fechaDesdeCal);
        this.formulario.get("fechahasta")!.setValue(this.fechaHastaCal);
        this.formulario
          .get("enviocorreo")!
          .setValue(data[0][2] === "S" ? true : false);
        this.formulario.get("dirigidoa")!.setValue(this.dirigidoa);
      });
  }

  filtrarOpcionesReportes() {
    let opkTempo: any = [];
    if (
      this.reporteServicio.opcionesReportes == null
      || this.reporteServicio.opcionesReportes.length === 0
      //|| this.reporteServicio.opcionesReportes === []
    ) {
      opkTempo = this.opcionesKioskosServicio
        .getOpcionesKiosco(
          this.usuarioServicio.empresa,
          this.usuarioServicio.usuario,
          this.usuarioServicio.cadenaConexion
        )
        .subscribe((data) => {
          opkTempo = data;
          this.reporteServicio.reportesEmpleado = opkTempo.filter(
            (opcKio: any) => opcKio["clase"] === "REPORTE" && opcKio['kiorol']['nombre'] === "EMPLEADO"
          );
          //Variable creada para agregar aparte el reporte del jefe 
          this.reporteServicio.reportesJefe = opkTempo.filter(
            (opcKio: any) => opcKio["clase"] === "REPORTE" && opcKio['kiorol']['nombre'] === "JEFE"
          );
          this.reporteServicio.reportesEmpleado = this.reporteServicio.reportesEmpleado.sort(function (a: any, b: any) {
            if (a.descripcion > b.descripcion) {
              return 1;
            }
            if (a.descripcion < b.descripcion) {
              return -1;
            }
            // a must be equal to b
            return 0;
          });
          this.reporteServicio.opcionesReportes = this.reporteServicio.reportesEmpleado.concat(this.reporteServicio.reportesJefe);
          this.reporteServicio.numeroReporte = (this.reporteServicio.opcionesReportes.length - 1) - (this.reporteServicio.reportesJefe.length - 1);
        });
    } else {
    }
  }

  getCorreoConexioneskioskos() {
    this.usuarioServicio
      .consultarCorreoConexioneskioskos(
        this.usuarioServicio.usuario,
        this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion
      )
      .subscribe((data: any) => {
        this.correo = data["result"];
      });
  }

  seleccionarReporte(index: number) {
    this.reporteServicio.reporteSeleccionado = this.reporteServicio.opcionesReportes[
      index
    ];
    this.reporteServicio.codigoReporteSeleccionado = this.reporteServicio.opcionesReportes[
      index
    ]["codigo"];
    this.reporteServicio.nombreReporteSeleccionado = this.reporteServicio.opcionesReportes[
      index
    ]["descripcion"];
    this.vigenciasCIR();
  }

  // consumo de servicio KIOVIGENCIASCIR
  vigenciasCIR() {
    this.opcionesKioskosServicio
      .getKioVigenciaCIR(this.usuarioServicio.empresa, this.reporteServicio.codigoReporteSeleccionado, this.usuarioServicio.cadenaConexion)
      .subscribe((data: any) => {
        this.opcionesKioskosServicio.kiovigCIR = data;
      });
  }

  limpiarSeleccionado() {
    this.reporteServicio.reporteSeleccionado = null;
  }

  enviar() {
    Object.values(this.formulario.controls).forEach((control: any) => {
      control.markAsTouched();
    });
    if (this.formulario.valid) {
      this.anocir = this.formulario.get("anoCIR")!.value
      if (this.reporteServicio.codigoReporteSeleccionado == "22") {
        let anioCir: any = this.opcionesKioskosServicio.kiovigCIR[this.anocir];
        this.ano = anioCir["ano"];
        this.fechadesde = this.ano + "-01-01";
        this.fechahasta = this.ano + "-12-31";
      } else {
        this.fechadesde = this.formulario.get("fechadesde")!.value;
        this.fechahasta = this.formulario.get("fechahasta")!.value;
      }

      if (this.fechadesde >= this.fechahasta) {
        const text =
          "<div class='alert alert-danger alert-dismissible fade show' role='alert'>" +
          '<i class="fa fa-exclamation-circle"></i>' +
          "Error: La fecha hasta debe ser mayor a la fecha desde." +
          "<button type='button' class='close' data-dismiss='alert' aria-label='Close'>" +
          "<span aria-hidden='true'>&times;</span>" +
          "</button>" +
          "</div>";
        document.getElementById("divm")!.innerHTML = text;
        document.getElementById("divm")!.style.display = "";
        swal.fire(
          "¡Validar fechas!",
          "La fecha hasta debe ser mayor a la fecha desde.",
          "error"
        );
        //return false;
      } else {
        document.getElementById("divm")!.innerHTML = "";
        document.getElementById("divm")!.style.display = "none";

        if (this.reporteServicio.reporteSeleccionado!["codigo"] === "22") {
          // si el reporte seleccionado es certingresos
          this.reporteServicio
            .validaFechasCertingresos(
              this.fechadesde,
              this.fechahasta,
              this.usuarioServicio.cadenaConexion
            )
            .subscribe((data: any) => {
              if (data) {
                this.actualizaParametros();
                return true;
              } else {
                swal.fire(
                  "¡Validar Fechas!",
                  "Para generar el Certificado de Ingresos y Retenciones se requiere que seleccione las fechas de todo un año " +
                  "(1 de enero a 31 de diciembre).",
                  "info"
                );
                return false;
              }
            });
        } else {
          this.actualizaParametros();
        }
      }
    }
  }

  formatoddmmyyyy(fecha: string) {
    let anio = fecha.substring(0, 4);
    let mes = fecha.substring(5, 7);
    let dia = fecha.substring(8, 11);
    let ensamble = dia + "-" + mes + "-" + anio;
    return ensamble;
  }

  cambioFechas(codigoReporte: string) {
    this.fechaDesdeCal = this.formulario.get("fechadesde")!.value;
    const ultimoDia = moment(this.fechaDesdeCal).endOf('month').format('YYYY-MM-DD');
    this.formulario.get("fechahasta")!.setValue(ultimoDia);
    this.fechaHastaCal = this.formulario.get("fechahasta")!.value;
  }

  actualizaParametros() {
    let msjConfirmacion = "";
    if (
      this.reporteServicio.codigoReporteSeleccionado == "25" ||
      this.reporteServicio.codigoReporteSeleccionado == "26" ||
      this.reporteServicio.codigoReporteSeleccionado == "27" ||
      this.reporteServicio.codigoReporteSeleccionado == "28" ||
      this.reporteServicio.codigoReporteSeleccionado == "29"
    ) {
      msjConfirmacion =
        "Se dispone a generar el reporte " +
        this.reporteServicio.nombreReporteSeleccionado +
        ". Tenga presente que para los valores de la certificación se tiene en cuenta la fecha de generación del reporte.";
    } else {
      msjConfirmacion =
        "Se dispone a generar el reporte " +
        this.reporteServicio.nombreReporteSeleccionado + " " +
        this.ano +
        " con fechas desde el " +
        this.fechadesde +
        " hasta el " +
        this.fechahasta;
    }
    let fechadesde: string = '';
    let fechahasta: string = '';
    if (this.reporteServicio.codigoReporteSeleccionado == "22") {
      let anioCir: any = this.opcionesKioskosServicio.kiovigCIR[this.anocir];
      let ano = anioCir["ano"];
      if (this.anocir != null) {
        fechadesde = ano + "-01-01";
        fechahasta = ano + "-12-31";
      } else {
        fechadesde = this.formulario.get("fechadesde")!.value;
        fechahasta = this.formulario.get("fechahasta")!.value;
      }
    } else {
      fechadesde = this.formulario.get("fechadesde")!.value;
      fechahasta = this.formulario.get("fechahasta")!.value;
    }
    swal.fire({
      title: "Confirmación",
      text: msjConfirmacion,
      icon: "info",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Aceptar",
      showCancelButton: true,
    })
      .then((result: any) => {
        if (result.value) {
          this.usuarioServicio
            .actualizaParametrosReportes(
              this.usuarioServicio.usuario,
              this.usuarioServicio.empresa,
              fechadesde,
              fechahasta,
              this.formulario.get("enviocorreo")!.value,
              this.formulario.get("dirigidoa")!.value,
              this.usuarioServicio.cadenaConexion
            )
            .subscribe(
              (data) => {
                if (data === 1) {
                  this.descargarReporte();
                }
              },
              (error) => {
                swal.fire(
                  "¡Se ha presentado un error!",
                  "Se presentó un error al actualizar las fechas del reporte, por favor inténtelo de nuevo más tarde.",
                  "error"
                );
              }
            );
        }
      });

  }

  /////////////////////////////////////////////////////////////////generar reporte 
  descargarReporte() {
    let anoArchivo;
    if (this.reporteServicio.codigoReporteSeleccionado == '22') {
      let anioCir: any = this.opcionesKioskosServicio.kiovigCIR[this.anocir];
      anoArchivo = anioCir["anoArchivo"];
      this.nombreRuta = this.reporteServicio.reporteSeleccionado!["nombreruta"] + anoArchivo;
    } else {
      this.fechaDesdeCal = this.formulario.get("fechadesde")!.value;
      this.fechaHastaCal = this.formulario.get("fechahasta")!.value;
      this.nombreRuta = this.reporteServicio.reporteSeleccionado!["nombreruta"];
    }
    swal.fire({
      title: "Generando reporte, por favor espere...",
      willOpen: () => {
        swal.showLoading();
        this.reporteServicio
          .generarReporte(
            this.nombreRuta,
            this.formulario.get("enviocorreo")!.value,
            //this.usuarioServicio.correo,
            this.correo,
            this.reporteServicio.reporteSeleccionado!["descripcion"],
            this.reporteServicio.codigoReporteSeleccionado,
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
                this.reporteServicio.reporteSeleccionado!["nombreruta"] +
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


  imagenReporte(opcion: any) {
    if (opcion.toLowerCase().indexOf("vaca") > -1) {
      return "assets/images/kioVacapendiente.png";
    } else if (opcion.toLowerCase().indexOf("certingresos") > -1) {
      return "assets/images/kio_certingresos.png";
    } else if (opcion.toLowerCase().indexOf("cesantias") > -1) {
      return "assets/images/kioSaldoCesantias.png";
    } else if (opcion.toLowerCase().indexOf("desprendible") > -1) {
      return "assets/images/kio_DesprendibleCO.png";
    } else {
      return "assets/images/reporte.png";
    }
  }

  cargarNotificaciones() {
    this.usuarioServicio.loadAllNotifications();
  }

}
