import { Component, OnInit, ViewChild } from '@angular/core';
import { VacacionesService } from 'src/app/services/vacaciones.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label, Color, BaseChartDirective, SingleDataSet } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';




@Component({
  selector: 'app-ver-solici-empleados',
  templateUrl: './ver-solici-empleados.component.html',
  styleUrls: ['./ver-solici-empleados.component.css']
})
export class VerSoliciEmpleadosComponent implements OnInit {

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
  tipoSolicitudSeleccionada;
  indexSolicitudSeleccionada;
  solicitudSeleccionada;
  public totalDiasVacacionesProv;
  private countEventsSubscription$: Subscription;
  private eventsOnChartLimit = 20;

  public polarAreaChartOptions: ChartOptions = {

    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    devicePixelRatio: 7,
    legend: {
      fullWidth: false,
      position: 'top',
      align: 'start',
      labels: {
        padding: 7,
        fontSize: 10,
        usePointStyle: true

      }
    },
    // We use these empty structures as placeholders for dynamic theming.

  };

  public polarAreaChartType: ChartType = 'polarArea';

  public polarAreaChartLegend = true;
  public polarAreaChartPlugins = [];
  public polarAreaChartColors = [
    {
      backgroundColor: ['rgba(91, 179, 174,0.3)', 'rgba(8, 104, 179,0.3)', 'rgba(26, 71, 186,0.3)', 'rgba(118, 54, 38,0.3)'],
    },
  ];
  public polarAreaChartLabels: Label[] = ['Días provisionados', 'Días Solicitados', 'Días aprobados', 'Días rechazados'];
  public polarAreaChartData: number[] = [];
  public polarAreaLegend = true;



  /////////////////////Pie////////////////
  public pieChartOptions: ChartOptions = {


    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    devicePixelRatio: 5,
    legend: {
      fullWidth: true,
      position: 'top',
      align: 'start',
      labels: {
        padding: 7,
        fontSize: 10,
        usePointStyle: true

      }
    },
    plugins: {

    },

  };

  public pieChartLabels: Label[] = [['Días provisionados'], ['Días Solicitados'], ['Días aprobados'], 'Días rechazados'];
  public pieChartData: number[] = [];

  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;

  public pieChartPlugins = [{

  }
  ];
  public pieChartColors = [
    {
      backgroundColor: ['rgba(91, 179, 174,0.3)', 'rgba(8, 104, 179,0.3)', 'rgba(26, 71, 186,0.3)', 'rgba(118, 54, 38,0.3)'],
    },
  ];


  constructor(private vacacionesService: VacacionesService, private usuarioService: UsuarioService) {

    // dias provisionados
    let diasProv: string = "";
    this.vacacionesService.getDiasVacacionesProvisionadas(this.usuarioService.usuario, this.usuarioService.empresa, this.usuarioService.cadenaConexion)
      .subscribe(
        data => {
          diasProv = data.toString();
          console.log('diasProv', data);
          this.polarAreaChartData.push(parseInt(diasProv, 0));
          this.pieChartData.push(parseInt(diasProv, 0));

        }
      );

    // dias Enviados
    let diasEnv: string = "";
    this.vacacionesService.getTotalDiasSolicitadosXUltimoEstado(this.usuarioService.usuario,
      this.usuarioService.empresa, this.usuarioService.cadenaConexion, 'ENVIADO')
      .subscribe(
        data => {
          diasEnv = data.toString();
          console.log('DiasEnv', data);
          this.polarAreaChartData.push(parseInt(diasEnv, 0));
          this.pieChartData.push(parseInt(diasEnv, 0));
        }
      )

    // dias Aprobados  
    let diasAprob: string = "";
    this.vacacionesService.getTotalDiasSolicitadosXUltimoEstado(this.usuarioService.usuario,
      this.usuarioService.empresa, this.usuarioService.cadenaConexion, 'AUTORIZADO')
      .subscribe(
        data => {
          diasAprob = data.toString();
          console.log('DiasAprob', data);
          this.polarAreaChartData.push(parseInt(diasAprob, 0));
          this.pieChartData.push(parseInt(diasAprob, 0));
        }
      )

      // dias Rechazados  
    let diasRecha: string = "";
    this.vacacionesService.getTotalDiasSolicitadosXUltimoEstado(this.usuarioService.usuario,
      this.usuarioService.empresa, this.usuarioService.cadenaConexion, 'RECHAZADO')
      .subscribe(
        data => {
          diasRecha = data.toString();
          console.log('diasRecha', data);
          this.polarAreaChartData.push(parseInt(diasRecha, 0));
          this.pieChartData.push(parseInt(diasRecha, 0));
        }
      )

  }

  ngOnInit() {
    if (this.usuarioService.documento == null || this.usuarioService.documento.lenght === 0) {
      this.usuarioService.getDocumentoSeudonimo(this.usuarioService.usuario, this.usuarioService.empresa)
        .subscribe(
          data => {
            console.log(data['result']);
            this.usuarioService.documento = data['result'];
            console.log('ng OnInit:', this.usuarioService.documento);
            this.consultarSoliciXEstados();
          }
        );
    } else {
      this.consultarSoliciXEstados();
    }
    //
    // this.countEventsSubscription$ = this.vacacionesService
    // .getServerSentEvent(`${environment.urlKioskoReportes}vacacionesPendientes/consultarDiasVacacionesProvisionados?seudonimo=${this.usuarioService.usuario}&nitempresa=${this.usuarioService.empresa}`)
    // .subscribe(event => {
    //   //let data = JSON.parse(event.);
    //   this.pushEventToChartData(event);
    //   console.log(" Sirveeeee ",event)
    // },
    // error=>{
    //   console.log('errorrrrr', error);
    // });



    //

    //   this.vacacionesService.getDiasVacacionesProvisionadas(this.usuarioService.usuario, this.usuarioService.empresa, this.usuarioService.cadenaConexion )
    //   .subscribe(
    //     data => {

    //       this.totalDiasVacacionesProv = event.data;
    //       this.pushEventToChartData(data);
    //       console.log(" totalDiasVacacionesProv ", data);
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
    console.log('tipoSolicitud: ' + tipoSolicitud);
    console.log('index seleccionado: ' + index);
    switch (tipoSolicitud) {
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
      /*default: {
        //this.solicitudSeleccionada = null;
      }*/
    }
    $('#staticBackdrop2').modal('show');
  }

  getSoliciEnviadas() {
    this.vacacionesService.getSolicitudesXEstado(this.usuarioService.documento, this.usuarioService.empresa, 'ENVIADO')
      .subscribe(
        data => {
          console.log("Datos iniciales");
          console.log(data);
          this.solicitudesEnviadas = data;
        }
      );
  }

  getSoliciAprobadas() {
    this.vacacionesService.getSolicitudesXEstado(this.usuarioService.documento, this.usuarioService.empresa, 'AUTORIZADO')
      .subscribe(
        data => {
          console.log(data);
          this.solicitudesAprobadas = data;
        }
      );
  }

  getSoliciRechazadas() {
    this.vacacionesService.getSolicitudesXEstado(this.usuarioService.documento, this.usuarioService.empresa, 'RECHAZADO')
      .subscribe(
        data => {
          console.log(data);
          this.solicitudesRechazadas = data;
        }
      );
  }

  getSoliciLiquidadas() {
    this.vacacionesService.getSolicitudesXEstado(this.usuarioService.documento, this.usuarioService.empresa, 'LIQUIDADO')
      .subscribe(
        data => {
          console.log(data);
          this.solicitudesLiquidadas = data;
        }
      );
  }

  getSoliciCanceladas() {
    this.vacacionesService.getSolicitudesXEstado(this.usuarioService.documento, this.usuarioService.empresa, 'CANCELADO')
      .subscribe(
        data => {
          console.log(data);
          this.solicitudesCanceladas = data;
        }
      );
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
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  changeLabels(): void {
    const words = ['hen', 'variable', 'embryo', 'instal', 'pleasant', 'physical', 'bomber', 'army', 'add', 'film',
      'conductor', 'comfortable', 'flourish', 'establish', 'circumstance', 'chimney', 'crack', 'hall', 'energy',
      'treat', 'window', 'shareholder', 'division', 'disk', 'temptation', 'chord', 'left', 'hospital', 'beef',
      'patrol', 'satisfied', 'academy', 'acceptance', 'ivory', 'aquarium', 'building', 'store', 'replace', 'language',
      'redeem', 'honest', 'intention', 'silk', 'opera', 'sleep', 'innocent', 'ignore', 'suite', 'applaud', 'funny'];
    const randomWord = () => words[Math.trunc(Math.random() * words.length)];
    this.pieChartLabels = Array.apply(null, { length: 4 }).map(_ => randomWord());
  }



  removeSlice(): void {
    this.pieChartLabels.pop();
    this.pieChartData.pop();
    this.pieChartColors[0].backgroundColor.pop();
  }

  changeLegendPosition(): void {
    this.pieChartOptions.legend.position = this.pieChartOptions.legend.position === 'left' ? 'top' : 'left';
  }





}
