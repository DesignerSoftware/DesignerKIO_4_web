import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VacacionesService } from 'src/app/services/vacaciones.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-ver-solici-empleados',
  templateUrl: './ver-solici-empleados.component.html',
  styleUrls: ['./ver-solici-empleados.component.scss']
})
export class VerSoliciEmpleadosComponent implements OnInit {

  _dataFiltLiq: string = '';
  _dataFiltEnv: string = '';
  _dataFiltApr: string = '';
  _dataFiltRech: string = '';
  _dataFiltCan: string = '';
  dataFilt: string = '';
  p: number = 1;
  p1: number = 1;
  p2: number = 1;
  p3: number = 1;
  p4: number = 1;
  p5: number = 1;
  solicitudesEnviadas: any = null;
  solicitudesAprobadas: any = null;
  solicitudesRechazadas: any = null;
  solicitudesLiquidadas: any = null;
  solicitudesCanceladas: any = null;
  tipoSolicitudSeleccionada: any;
  indexSolicitudSeleccionada: any;
  solicitudSeleccionada: any;
  solicitudesFiltradas: any = null;
  //public totalDiasVacacionesProv: any;
  //private countEventsSubscription$: Subscription;
  //private eventsOnChartLimit = 20;

  //Inicio estructuras para la grafica pie
  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  pieChartPlugins = [];
  pieChartLabels: any = ['Días provisionados',
    'Días en dinero',
    'Días disfrutados',
    'Días liquidados'
  ];
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Días provisionados',
      'Días en dinero',
      'Días disfrutados',
      'Días liquidados'
    ],
    datasets: [{
      data: []
    }]
  };
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    }
  };
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
    // dias provisionados
    let diasProv: string = "";
    this.vacacionesService
      .getDiasVacacionesProvisionadas(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        this.usuarioService.cadenaConexion
      )
      .subscribe((data: any) => {
        diasProv = data.toString();
        this.pieChartData.datasets[0].data.push(parseInt(diasProv, 0));
      });

    // dias Enviados
    this.vacacionesService
      .getDiasNovedadesVaca(
        this.usuarioService.empresa,
        this.usuarioService.usuario,
        this.usuarioService.cadenaConexion
      )
      .subscribe((data: any) => {
        let diasEnv = data;
        this.pieChartData.datasets[0].data.push(parseInt(diasEnv[0][2], 0));
        this.pieChartData.datasets[0].data.push(parseInt(diasEnv[1][2], 0));
        this.pieChartData.datasets[0].data.push(parseInt(diasEnv[2][2], 0));
      });

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

  detalleSolicitud(tipoSolicitud: string, index: number) {
    this.tipoSolicitudSeleccionada = tipoSolicitud;
    this.indexSolicitudSeleccionada = index;
    switch (tipoSolicitud) {
      case "ENVIADO": {
        this.solicitudSeleccionada = this.solicitudesEnviadas[index];
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
    }
    $("#staticBackdrop2").modal("show");
    document.getElementById('staticBackdrop2')!.style.display = 'block';
  }

  getSoliciEnviadas() {
    this.vacacionesService
      .getSolicitudesXEstado(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        "ENVIADO", this.usuarioService.cadenaConexion
      )
      .subscribe((data: any) => {
        this.solicitudesEnviadas = data;
      });
  }

  getSoliciAprobadas() {
    this.vacacionesService
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
    this.vacacionesService
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
    this.vacacionesService
      .getSolicitudesXEstado(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        'LIQUIDADO', this.usuarioService.cadenaConexion
      )
      .subscribe((data: any) => {
        this.solicitudesLiquidadas = data;
        this.solicitudesFiltradas = data;
      });
  }

  getSoliciCanceladas() {
    this.vacacionesService
      .getSolicitudesXEstado(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        'CANCELADO', this.usuarioService.cadenaConexion
      )
      .subscribe((data: any) => {
        this.solicitudesCanceladas = data;
      });
  }

  // events pie
  public chartClicked({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
  }

  public chartHovered({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
  }

  removeSlice(): void {
    this.pieChartData.labels?.pop();
    this.pieChartData.datasets[0].data.pop();
    this.pieChartColors[0].backgroundColor.pop();
    this.pieChartLabels.pop();
  }

  detalleSolicitud2(tipoSolicitud: string, index: number) {
    this.tipoSolicitudSeleccionada = tipoSolicitud;
    this.indexSolicitudSeleccionada = index;
    switch (tipoSolicitud) {
      case "ENVIADO": {
        this.solicitudSeleccionada = this.solicitudesEnviadas[index];
        break;
      }
    }
    $("#staticBackdrop3").modal("show");
  }

  cancelarEnvio() {
    let cancelado;
    swal
      .fire({
        title: "¿Está seguro que desea cancelar la solicitud?",
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
            title: "Enviando la solicitud al sistema, por favor espere...",
            willOpen: () => {
              swal.showLoading();
              this.vacacionesService
                .setNuevoEstadoSolicio(
                  this.usuarioService.usuario,
                  this.usuarioService.empresa,
                  this.usuarioService.cadenaConexion,
                  "CANCELADO",
                  this.solicitudSeleccionada[10],
                  '',
                  this.usuarioService.urlKioscoDomain,
                  this.usuarioService.grupoEmpresarial,
                  this.solicitudSeleccionada[4],
                  this.solicitudSeleccionada[13],
                  this.solicitudSeleccionada[14],
                  this.solicitudSeleccionada[15]
                )
                .subscribe(
                  (data: any) => {
                    //console.log(data);
                    if (data) {
                      $('#staticBackdrop3').modal('hide');
                      swal
                        .fire({
                          icon: "success",
                          title:
                            "Solicitud de vacaciones cancelada exitosamente",
                          showConfirmButton: true,
                        })
                        .then((res) => {
                          this.reloadPage();
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
                          this.reloadPage();
                        });
                    }
                  },
                  (error) => {
                    swal
                      .fire({
                        icon: 'error',
                        title: 'Ha ocurrido un error al crear la solicitud',
                        text:
                          'Por favor inténtelo de nuevo más tarde. Si el error persiste contáctese con el área de nómina y recursos humanos de su empresa.',
                        showConfirmButton: true,
                      })
                      .then((res) => {
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

  reloadPage() {
    this.ngOnInit();
  }

  get dataFiltLiq(): string {
    return this._dataFiltLiq;
  }

  set dataFiltLiq(val: string) {
    this._dataFiltLiq = val;
    this.solicitudesLiquidadas = this.filter(val, 1);
  }

  get dataFiltEnv(): string {
    return this._dataFiltEnv;
  }

  set dataFiltEnv(val: string) {
    this._dataFiltEnv = val;
    this.solicitudesEnviadas = this.filter(val, 2);
  }

  get dataFiltApr(): string {
    return this._dataFiltApr;
  }

  set dataFiltApr(val: string) {
    this._dataFiltApr = val;
    this.solicitudesAprobadas = this.filter(val, 3);
  }

  get dataFiltRech(): string {
    return this._dataFiltRech;
  }

  set dataFiltRech(val: string) {
    this._dataFiltRech = val;
    this.solicitudesRechazadas = this.filter(val, 4);
  }

  get dataFiltCan(): string {
    return this._dataFiltCan;
  }

  set dataFiltCan(val: string) {
    this._dataFiltCan = val;
    this.solicitudesCanceladas = this.filter(val, 5);
  }

  filter(v: string, t: number) {
    if (v === '') {
      switch (t) {
        case 1: {
          this.getSoliciLiquidadas();
          break;
        }
        case 2: {
          this.getSoliciEnviadas();
          break;
        }
        case 3: {
          this.getSoliciAprobadas();
          break;
        }
        case 4: {
          this.getSoliciRechazadas();
          break;
        }
        case 5: {
          this.getSoliciCanceladas();
          break;
        }
        default: {
          break;
        }
      }
    }
    switch (t) {
      case 1: {
        this.solicitudesFiltradas = this.solicitudesLiquidadas;
        break;
      }
      case 2: {
        this.solicitudesFiltradas = this.solicitudesEnviadas;
        break;
      }
      case 3: {
        this.solicitudesFiltradas = this.solicitudesAprobadas;
        break;
      }
      case 4: {
        this.solicitudesFiltradas = this.solicitudesRechazadas;
        break;
      }
      case 5: {
        this.solicitudesFiltradas = this.solicitudesCanceladas;
        break;
      }
      default: {
        this.solicitudesFiltradas = null;
        break;
      }
    }
    return this.solicitudesFiltradas.filter((x: any) => x[0]?.toString().toLowerCase().indexOf(v.toLowerCase()) !== -1
      || x[1]?.toString()?.toLowerCase().indexOf(v.toLowerCase()) !== -1
      || x[2]?.toString().toLowerCase().indexOf(v.toLowerCase()) !== -1
      || x[3]?.toString().toLowerCase().indexOf(v.toLowerCase()) !== -1
      || x[4]?.toString().toLowerCase().indexOf(v.toLowerCase()) !== -1
      //|| x[9]?.toString().toLowerCase().indexOf(v.toLowerCase()) !== -1
    );
  }
}
