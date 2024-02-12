import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Chart, ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { ReportesService } from 'src/app/services/reportes.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VacacionesService } from 'src/app/services/vacaciones.service';
import swal from 'sweetalert2';
import * as moment from 'moment';
import 'moment/locale/es-mx';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // recibe valor de pages.component
  @Input() urlLogoEmpresaDarkXl = 'assets/images/fotos_empleados/logodesigner-dark-xl.png';
  urlValidacion: string = '';
  totalDiasVacacionesProv: any = "...";

  totalDiasVacacionesSubtipo: any = null;
  prima: string = '';      //provisiones
  cesantias: string = '';    //provisiones
  interCesantias: string = '';   //provisiones
  vacaciones: string = '';   //provisiones
  proverbio: string = '';
  today: string = '';

  formulario: FormGroup = {} as FormGroup;

  //Inicio estructuras para grafica radial
  polarAreaLegend = true;
  polarAreaChartLegend = true;
  polarAreaChartType: ChartType = 'polarArea';
  polarAreaChartLabels: string[] = [
    'Días provisionados'
    , 'Días en dinero'
    , 'Días disfrutados'
    , 'Días liquidados'
  ];
  polarAreaChartData: ChartData<'polarArea'> = {
    labels: this.polarAreaChartLabels,
    datasets: [{
      data: [],
      label: 'Vacaciones'
    }]
  };
  polarAreaChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    }
  };
  //Fin estructuras para grafica radial

  //Inicio estructuras para grafica de lineas
  lineChartLegend = false;
  lineChartType: ChartType = 'line';
  lineChartLabels = [];
  lineChartData: ChartConfiguration['data'] = {
    datasets: [{
      data: [],
      label: 'Neto',
      backgroundColor: 'rgba(229,232,232,0.9)',
      borderColor: 'blue',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
      fill: 'origin',
      tension: 0.5,
    }],
    labels: [''],
  };
  lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5,
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Fechas de pago'
        }
      },
      y: {
        position: 'left',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Millones de pesos'
        }
      },
    },
    plugins: {
    },
    responsive: true
  };
  //Fin estructuras para grafica de lineas

  constructor(private fb: FormBuilder,
    public usuarioServicio: UsuarioService,
    private router: Router,
    private cadenasKioskos: CadenaskioskosappService,
    private vacacionesService: VacacionesService,
    private reporteServicio: ReportesService) {
    moment.locale('es-mx');
    this.consultarFechaActual()
    if (this.usuarioServicio.empresa == '') {
      console.log('HomeComponent constructor');
      console.log('Empresa en blanco');
    }
  }

  consultarFechaActual(): void {
    this.today = moment(new Date()).format('dddd') + ', ' + moment(new Date()).format('DD') + ' de ' + moment(new Date()).format('MMMM') + ' de ' + moment(new Date()).format('YYYY');
  }

  crearFormulario() {
    this.formulario = this.fb.group(
      {
        mensaje: ["", Validators.required]
      }
    );
  }

  ngOnInit() {
    if (this.usuarioServicio.cadenaConexion) {
      this.cargarDatosIniciales();
    } else {
      this.getInfoUsuario();
    }
    this.crearFormulario();
  }

  urlKiosko() {
    let urltemp = this.usuarioServicio.getUrl();
    return urltemp
  }

  updateDatosUrl() {
    this.urlValidacion = this.urlKiosko();
    if (this.usuarioServicio.urlKioscoDomain != this.urlValidacion) {
      this.usuarioServicio.urlKioscoDomain = this.urlValidacion
    }
  }

  // obtener la información del usuario del localStorage y guardarla en el service
  getInfoUsuario() {
    const sesion = this.usuarioServicio.getUserLoggedIn();
    this.usuarioServicio.setUsuario(sesion['usuario']);
    this.usuarioServicio.setEmpresa(sesion['empresa']);
    this.usuarioServicio.setTokenJWT(sesion['JWT']);
    this.usuarioServicio.setGrupo(sesion['grupo']);
    this.usuarioServicio.setUrlKiosco(sesion['urlKiosco']);
    this.updateDatosUrl();
    this.cadenasKioskos.getCadenaKioskoXGrupoNit(sesion['grupo'], sesion['empresa'])
      .subscribe(
        data => {
          if (Array.isArray(data)) {
            var val1 = Object.values(data);
            val1.forEach((v1) => {
              if (Array.isArray(v1)) {
                var val2 = Object.values(v1);
                if (val2[3] === sesion['grupo']) { // GRUPO
                  this.usuarioServicio.cadenaConexion = val2[4];
                  this.cargarDatosIniciales();
                }
              }
            });
          }
        }
      );
  }

  // consultar total dias provisionados
  consultarDiasProvisionados(): void {
    let diasProv: any;
    this.vacacionesService
      .getDiasVacacionesProvisionadas(
        this.usuarioServicio.usuario,
        this.usuarioServicio.empresa,
        this.usuarioServicio.cadenaConexion
      )
      .subscribe((data: any) => {
        this.totalDiasVacacionesProv = data;
        diasProv = data;
        //this.polarAreaChartData.datasets[0].data.push(parseInt(diasProv, 0));
        this.polarAreaChartData.datasets[0].data[0] = parseInt(diasProv, 0);
      });
  }

  // obtener dias de vacaciones
  consultarDiasVacaciones(): void {
    let diasEnv: any;
    this.vacacionesService
      .getDiasNovedadesVaca(
        this.usuarioServicio.empresa,
        this.usuarioServicio.usuario,
        this.usuarioServicio.cadenaConexion
      )
      .subscribe((data: any) => {
        //this.totalDiasVacacionesSubtipo = data;
        diasEnv = data;
        this.polarAreaChartData.datasets[0].data.push(parseInt(diasEnv[0][2], 0));
        this.polarAreaChartData.datasets[0].data.push(parseInt(diasEnv[1][2], 0));
        this.polarAreaChartData.datasets[0].data.push(parseInt(diasEnv[2][2], 0));
       /*
        this.polarAreaChartData.datasets[0].data[1] = parseInt(diasEnv[0][2], 0);
        this.polarAreaChartData.datasets[0].data[2] = parseInt(diasEnv[1][2], 0);
        this.polarAreaChartData.datasets[0].data[3] = parseInt(diasEnv[2][2], 0);
        */
        this.totalDiasVacacionesSubtipo = data;
       
      });
  }

  getProverbios() {
    if (this.usuarioServicio.listProverbios == null) {
      this.usuarioServicio
        .getProverbios(
          this.usuarioServicio.cadenaConexion,
          this.usuarioServicio.empresa
        )
        .subscribe((data: any) => {
          this.usuarioServicio.listProverbios = data[Math.floor(Math.random() * data.length)];
        });
    }
  }

  cargarNotificaciones() {
    this.usuarioServicio.loadAllNotifications();
  }

  cargarUltimosPagos() {
    this.usuarioServicio.getUltimosPagos(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
      .subscribe(
        (data: any) => {
          let temp: any = data;
          let tempDatos: any = [];
          let tempLabel: any = [];
          let temNumeroDec: any = [];
          let tempChartLabels: any = [];

          for (let i = 0; i < temp.length; i++) {
            tempDatos.push(parseInt(temp[i][3]) / 1000000);
            temNumeroDec = tempDatos.map((a: any) => a.toFixed(3));
            tempLabel.push(temp[i][2]);
            tempChartLabels.push(temp[i][1]);
          }

          this.lineChartData.datasets[0].data = temNumeroDec;
          this.lineChartData.labels = tempChartLabels;
          this.lineChartLabels = tempLabel;
        });
  }

  cargarProvisiones() {
    this.usuarioServicio.getProvisiones(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
      .subscribe(
        (data) => {
          if (Array.isArray(data)) {
            this.usuarioServicio.provisiones = data;
          }
          this.prima = this.usuarioServicio.provisiones[2][1];
          this.cesantias = this.usuarioServicio.provisiones[0][1];
          this.interCesantias = this.usuarioServicio.provisiones[1][1];
          this.vacaciones = this.usuarioServicio.provisiones[3][1];
        }
      )
  }

  cargarDatosIniciales() {
    this.consultarDiasProvisionados();
    this.consultarDiasVacaciones();
    this.getProverbios();
    this.cargarNotificaciones();
    this.cargarUltimosPagos();
    this.cargarProvisiones();
  }

  abrirModal() {
    $("#staticBackdrop").modal("show");
  }

  sumaDias(num1: string, num2: string) {
    const numero1: number = parseFloat(num1);
    const numero2: number = parseFloat(num2);
    return Math.round(numero1 + numero2);
  }

  enviarReporteNovedad() {
    if (this.formulario.valid) {
      swal.fire({
        title: "Enviando mensaje al área de nómina y RRHH, por favor espere...",
        willOpen: () => {
          swal.showLoading();
          this.usuarioServicio.enviaCorreoNovedadRRHH(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.formulario.get('mensaje')!.value,
            'Solicitud para Corrección de información', this.usuarioServicio.urlKioscoDomain, this.usuarioServicio.grupoEmpresarial, this.usuarioServicio.cadenaConexion)
            .subscribe(
              (data: any) => {
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
                  swal.fire({
                    icon: "error",
                    title: "No fue posible enviar el correo",
                    text: 'Por favor inténtelo de nuevo más tarde.',
                    showConfirmButton: true,
                  })
                    .then((res: any) => {
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
                  .then((res: any) => {
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

  descargarReporte() {
    let nombreArchivo = 'kioCertificacionProvisiones';
    let envioCorreo = false;
    swal.fire({
      title: "Generando reporte, por favor espere...",
      willOpen: () => {
        swal.showLoading();
        this.reporteServicio
          .generarReporteprovisiones(
            nombreArchivo,
            this.usuarioServicio.empresa,
            this.usuarioServicio.cadenaConexion,
            this.usuarioServicio.usuario,
          )
          .subscribe(
            (res: any) => {
              swal.fire({
                icon: "success",
                title:
                  "Reporte generado exitosamente, se descargará en un momento",
                showConfirmButton: false,
                timer: 1500,
              });
              const newBlob = new Blob([res], { type: "application/pdf" });
              let fileUrl = window.URL.createObjectURL(newBlob);
              let nav = (window.navigator as any);
              if (nav.msSaveOrOpenBlob) {
                nav.msSaveOrOpenBlob(
                  newBlob,
                  fileUrl.split(":")[1] + ".pdf"
                );
              } else {
                window.open(fileUrl);
              }
              // Create a link pointing to the ObjectURL containing the blob.
              const data = window.URL.createObjectURL(newBlob);
              const link = document.createElement("a");
              link.href = data;
              let f = new Date();
              link.download =
                nombreArchivo +
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

}
