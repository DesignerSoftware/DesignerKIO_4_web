import { Component, OnInit, ViewChild } from '@angular/core';
import { VacacionesService } from 'src/app/services/vacaciones.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label, Color, BaseChartDirective, SingleDataSet } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import swal from 'sweetalert2';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { AusentismosService } from 'src/app/services/ausentismos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-ausentismos-reportados',
  templateUrl: './ver-ausentismos-reportados.component.html',
  styleUrls: ['./ver-ausentismos-reportados.component.css']
})
export class VerAusentismosReportadosComponent implements OnInit {
  solicitudesEnviadas = null;
  public dataFilt: any = "";
  public p: number = 1;
  public p1: number = 1;
  public p2: number = 1;
  public p3: number = 1;
  public p4: number = 1;
  public p5: number = 1;
  solicitudesAprobadas = null;
  solicitudesRechazadas = null;
  solicitudesLiquidadas = null;
  solicitudesCanceladas = null;
  anexoSeleccionado = null;
  estadoSolicitudSeleccionada = null;
  tipoSolicitudSeleccionada;
  indexSolicitudSeleccionada;
  solicitudSeleccionada;
  public totalDiasVacacionesProv;
  private countEventsSubscription$: Subscription;
  private eventsOnChartLimit = 20;
  /////////////////////Pie////////////////
  public pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    devicePixelRatio: 5,
    legend: {
      fullWidth: true,
      position: "top",
      align: "start",
      labels: {
        padding: 7,
        fontSize: 10,
        usePointStyle: true,
      },
    },
    plugins: {},
  };

  public pieChartLabels: Label[] = [
    ["Días provisionados"],
    ["Días en dinero"],
    ["Días disfrutados"],
    "Días liquidados",
  ];
  public pieChartData: number[] = [];

  public pieChartType: ChartType = "pie";
  public pieChartLegend = true;

  public pieChartPlugins = [{}];
  public pieChartColors = [
    {
      backgroundColor: [
        "rgba(91, 179, 174,0.3)",
        "rgba(8, 104, 179,0.3)",
        "rgba(26, 71, 186,0.3)",
        "rgba(118, 54, 38,0.3)",
      ],
    },
  ];

  constructor(
    private vacacionesService: VacacionesService,
    private usuarioService: UsuarioService,
    private router : Router,
    private ausentismoService: AusentismosService, 
    private cadenasKioskos: CadenaskioskosappService
  ) {

  }

  ngOnInit() {
    if (this.usuarioService.cadenaConexion) {
      this.cargarDatosIniciales();
    } else {
      this.getInfoUsuario();
    }    
    //
    // this.countEventsSubscription$ = this.vacacionesService
    // .getServerSentEvent(`${environment.urlKioskoReportes}vacacionesPendientes/consultarDiasVacacionesProvisionados?seudonimo=${this.usuarioService.usuario}&nitempresa=${this.usuarioService.empresa}`)
    // .subscribe(event => {
    //   //let data = JSON.parse(event.);
    //   this.pushEventToChartData(event);
    //   //console.log(" Sirveeeee ",event)
    // },
    // error=>{
    //   //console.log('errorrrrr', error);
    // });

    //

    //   this.vacacionesService.getDiasVacacionesProvisionadas(this.usuarioService.usuario, this.usuarioService.empresa, this.usuarioService.cadenaConexion )
    //   .subscribe(
    //     data => {

    //       this.totalDiasVacacionesProv = event.data;
    //       this.pushEventToChartData(data);
    //       //console.log(" totalDiasVacacionesProv ", data);
    //     }
    //   );
  }

  // private pushEventToChartData(event): void {
  //   if (this.isChartDataFull(this.pieChartData, 20)) {
  //     this.removeLastElementFromChartDataAndLabel();
  //   }
  //   this.pieChartData[0].data.push(event.count);
  //   this.pieChartLabels.push(
  //     this.getLabel(event)
  //   );
  // }
  // private getLabel(event): string {
  //   return `${event.window}`;
  // }
  // private removeLastElementFromChartDataAndLabel(): void {
  //   this.pieChartData[0].data = this.pieChartData[0].data.slice(1);
  //   this.pieChartLabels = this.pieChartLabels.slice(1);
  // }
  // private isChartDataFull(chartData: ChartDataSets[], limit: number): boolean {
  //   return chartData[0].data.length >= limit;
  // }

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

  detalleSolicitud(tipoSolicitud: string, index: string) {
    this.tipoSolicitudSeleccionada = tipoSolicitud;
    this.indexSolicitudSeleccionada = index;
    this.estadoSolicitudSeleccionada = null;
    //console.log("tipoSolicitud: " + tipoSolicitud);
    //console.log("index seleccionado: " + index);
    //console.log(this.estadoSolicitudSeleccionada);
    switch (tipoSolicitud) {
      case "ENVIADO": {
        this.solicitudSeleccionada = this.solicitudesEnviadas[index];
        this.estadoSolicitudSeleccionada =  this.solicitudesRechazadas[index][4];         
        break;
      }
      case "APROBADO": {
        this.solicitudSeleccionada = this.solicitudesAprobadas[index];
        break;
      }
      case "RECHAZADO": {
        this.solicitudSeleccionada = this.solicitudesRechazadas[index];
        break;
      }
      case "LIQUIDADO": {
        this.solicitudSeleccionada = this.solicitudesLiquidadas[index];
        break;
      }
      case "CANCELADO": {
        this.solicitudSeleccionada = this.solicitudesCanceladas[index];
        break;
      }
      /*default: {
        //this.solicitudSeleccionada = null;
      }*/
      
    }
    $("#staticBackdrop2").modal("show");
    document.getElementById('staticBackdrop2').style.display = 'block';
  }

  getSoliciEnviadas() {
    this.ausentismoService
      .getSolicitudesXEstado(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        "ENVIADO", this.usuarioService.cadenaConexion
      )
      .subscribe((data) => {
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
      .subscribe((data) => {
        //console.log(data);
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
      .subscribe((data) => {
        //console.log(data);
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
      .subscribe((data) => {
        //console.log(data);
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
      .subscribe((data) => {
        //console.log(data);
        this.solicitudesCanceladas = data;
      });
  }

  // events char

  // public randomize(): void {
  //   // Only Change 3 values
  //   this.pieChartData[0].data = [
  //     Math.round(Math.random() * 100),
  //     59,
  //     80,
  //     (Math.random() * 100),
  //     56,
  //     (Math.random() * 100),
  //     40 ];
  // }

  // events pie
  public chartClicked({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    //console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    //console.log(event, active);
  }

  changeLabels(): void {
    const words = [
      "hen",
      "variable",
      "embryo",
      "instal",
      "pleasant",
      "physical",
      "bomber",
      "army",
      "add",
      "film",
      "conductor",
      "comfortable",
      "flourish",
      "establish",
      "circumstance",
      "chimney",
      "crack",
      "hall",
      "energy",
      "treat",
      "window",
      "shareholder",
      "division",
      "disk",
      "temptation",
      "chord",
      "left",
      "hospital",
      "beef",
      "patrol",
      "satisfied",
      "academy",
      "acceptance",
      "ivory",
      "aquarium",
      "building",
      "store",
      "replace",
      "language",
      "redeem",
      "honest",
      "intention",
      "silk",
      "opera",
      "sleep",
      "innocent",
      "ignore",
      "suite",
      "applaud",
      "funny",
    ];
    const randomWord = () => words[Math.trunc(Math.random() * words.length)];
    this.pieChartLabels = Array.apply(null, { length: 4 }).map((_) =>
      randomWord()
    );
  }

  removeSlice(): void {
    this.pieChartLabels.pop();
    this.pieChartData.pop();
    this.pieChartColors[0].backgroundColor.pop();
  }

  changeLegendPosition(): void {
    this.pieChartOptions.legend.position =
      this.pieChartOptions.legend.position === "left" ? "top" : "left";
  }

  detalleSolicitud2(tipoSolicitud: string, index: string) {
    this.tipoSolicitudSeleccionada = tipoSolicitud;
    this.indexSolicitudSeleccionada = index;
    //console.log("tipoSolicitud: " + tipoSolicitud);
    //console.log("index seleccionado: " + index);
    //console.log(this.estadoSolicitudSeleccionada);
    switch (tipoSolicitud) {
      case "ENVIADO": {
        this.solicitudSeleccionada = this.solicitudesEnviadas[index];
        this.anexoSeleccionado = this.solicitudesEnviadas[index][15];
        this.estadoSolicitudSeleccionada =  this.solicitudesEnviadas[index][4];
        break;
      }
    }
    console.log(this.estadoSolicitudSeleccionada);
    $("#staticBackdrop3").modal("show");
    $("#staticBackdrop2").modal("show");
    document.getElementById('staticBackdrop2').style.display = 'block';
  }

  cancelarEnvio() {
    let cancelado;
    swal
      .fire({
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
          /*this.ausentismoService
            .setNuevoEstadoSolicio(
              this.usuarioService.usuario,
              this.usuarioService.empresa,
              this.usuarioService.cadenaConexion,
              "CANCELADO",
              this.solicitudSeleccionada[10],
              null,
              this.usuarioService.urlKioscoDomain,
              this.usuarioService.grupoEmpresarial
            )
            .subscribe((data) => {
              cancelado = data.toString();
              //console.log("diasRecha", data);
              if (data) {
                swal
                  .fire({
                    title: "Cancelada!",
                    text: "Su solicitud enviada ha sido cancelada. ",
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Ok",
                  })
                  .then((result2) => {
                    if (result2.isConfirmed) {
                      this.reloadPage();
                    }
                  });
              } else {
                swal.fire(
                  "Ha habido un problema!",
                  "Su solicitud enviada no ha podido ser cancelada.",
                  "error"
                );
              }
            });*/


            swal.fire({
              title: "Enviando la novedad al sistema, por favor espere...",
              onBeforeOpen: () => {
                swal.showLoading();
          this.ausentismoService
            .setNuevoEstadoSolicio(
              this.usuarioService.usuario,
              this.usuarioService.empresa,
              this.usuarioService.cadenaConexion,
              "CANCELADO",
              this.solicitudSeleccionada[1],
              this.solicitudSeleccionada[14],
              null,
              this.usuarioService.urlKioscoDomain,
              this.usuarioService.grupoEmpresarial
            )
            .subscribe(
                    (data) => {
                      //console.log(data);
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
                            //this.router.navigate(["/vacaciones"]);
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
                          //this.router.navigate(["/vacaciones"]);
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
      onBeforeOpen: () => {
        swal.showLoading();
        console.log("descargarReporte");
        this.ausentismoService
          .getAnexoAusentismo(
            //this.reporteServicio.reporteSeleccionado["nombreruta"],
            //this.usuarioService.secuenciaEmpleado,
            //this.formulario.get("enviocorreo").value,
            //this.usuarioService.correo,
            //this.correo,
            //this.reporteServicio.reporteSeleccionado["descripcion"],
            //this.reporteServicio.codigoReporteSeleccionado,
            this.anexoSeleccionado,
            this.usuarioService.empresa,
            this.usuarioService.cadenaConexion
            //this.usuarioService.usuario,
            //this.usuarioService.grupoEmpresarial,
            //this.usuarioService.urlKioscoDomain
          )
          .subscribe(
            (res) => {
              console.log("ejemplo 1 : ",res);
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
    //this.ngOnInit();
    this.router.navigate(['/ausentismos']);
  }

  
}
