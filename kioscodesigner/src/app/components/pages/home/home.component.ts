import { Component, OnInit, Injectable, Input } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { Router } from '@angular/router';
import { VacacionesService } from 'src/app/services/vacaciones.service';
import { Label, Color } from 'ng2-charts';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { ReportesService } from 'src/app/services/reportes.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


@Injectable()
export class HomeComponent implements OnInit {
  @Input() urlLogoEmpresaDarkXl = 'assets/images/fotos_empleados/logodesigner-dark-xl.png'; // recibe valor de pages.component
  totalDiasVacacionesProv: any = "...";
  //listProverbios:Array <string> =[];
  //listProverbios: any= null;
  proverbio:string ='';
  urlValidacion = null;
  public totalDiasVacacionesSubtipo = null;
  formulario: FormGroup;
  today: number = Date.now();
  prima: String;      //provisiones
  cesantias: String;    //provisiones
  interCesantias: String;   //provisiones
  vacaciones: String;   //provisiones

  public polarAreaChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    devicePixelRatio: 7,
    legend: {
      fullWidth: false,
      position: "top",
      align: "start",
      labels: {
        padding: 7,
        fontSize: 10,
        usePointStyle: true,
      },
    },
    // We use these empty structures as placeholders for dynamic theming.
  };

  public polarAreaChartType: ChartType = "polarArea";

  public polarAreaChartLegend = true;
  public polarAreaChartPlugins = [];
  public polarAreaChartColors = [
    {
      backgroundColor: [
        "rgba(91, 179, 174,0.3)",
        "rgba(8, 104, 179,0.3)",
        "rgba(26, 71, 186,0.3)",
        "rgba(118, 54, 38,0.3)",
      ],
    },
  ];
  public polarAreaChartLabels: Label[] = [
    "Días en dinero",
    "Días disfrutados",
    "Días liquidados",
    "Días provisionados",
  ];

  public lineChartData: ChartDataSets[] = [
    //{ data: [12, 72, 78, 75 ,17 ,75 ], label: 'Prueba1'}    
  ];

  public lineChartLabels: Label[] = [
    //"enero","febrero","marzo","abril"
  ];

  public lineChartOptions = { 
    responsive: true,
    legend: {
      display: false,
      fullWidth: false,
      position: "top",
      align: "start",
      labels: {
        padding: 7,
        fontSize: 10,
        usePointStyle: true,
      },
    },options: {
      scales: {
          y: {
              display: false
          }
      }
   }};

  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgb(176, 196, 222, .5)'
    },
  ];

  public lineChartLegend = true;
  public lineChartPlugins = [];
  public lineChartType: ChartType = "line";

  /*nose(){
    this.lineChartData = [
      { data: [Math.random() * (100-0) + 0, Math.random() * (100-0) + 0, 
        Math.random() * (100-0) + 0, Math.random() * (100-0) + 0 ,Math.random() * (100-0) + 0 ,Math.random() * (100-0) + 0 ], label: 'Prueba1'},
      { data: [Math.random() * (100-0) + 0, Math.random() * (100-0) + 0, Math.random() * (100-0) + 0, 
        Math.random() * (100-0) + 0 ,Math.random() * (100-0) + 0 ,Math.random() * (100-0) + 0 ], label: 'Prueba2'}
    ];

  }*/
  
  public polarAreaChartData: number[] = [];
  public polarAreaLegend = true;

  constructor(private fb: FormBuilder, public usuarioServicio: UsuarioService, private router: Router, private cadenasKioskos: CadenaskioskosappService,
    private opcionesKioskosService: OpcionesKioskosService, private vacacionesService: VacacionesService, private reporteServicio: ReportesService) {
    if (this.usuarioServicio.empresa == '') {

    }
    //console.log('constructor home');
  }


  ngOnInit() {
    //console.log('ngOnInit home');
    //console.log('this.listProverbios:', this.listProverbios);
    if (this.usuarioServicio.cadenaConexion) {
      this.cargarDatosIniciales();
    } else {
      this.getInfoUsuario();
    }
    this.crearFormulario();
  }

  getInfoUsuario() { // obtener la información del usuario del localStorage y guardarla en el service
    const sesion = this.usuarioServicio.getUserLoggedIn();
    this.usuarioServicio.setUsuario(sesion['usuario']);
    this.usuarioServicio.setEmpresa(sesion['empresa']);
    this.usuarioServicio.setTokenJWT(sesion['JWT']);
    this.usuarioServicio.setGrupo(sesion['grupo']);
    this.usuarioServicio.setUrlKiosco(sesion['urlKiosco']);
    //console.log('usuario: ' + this.usuarioServicio.usuario + ' empresa: ' + this.usuarioServicio.empresa);
    this.updateDatosUrl();
    this.cadenasKioskos.getCadenaKioskoXGrupoNit(sesion['grupo'], sesion['empresa'])
      .subscribe(
        data => {
          //console.log('getInfoUsuario', data);
          //console.log(sesion['grupo']);
          for (let i in data) {
            if (data[i][3] === sesion['grupo']) { // GRUPO
              const temp = data[i];
              //console.log('cadena: ', temp[4]) // CADENA
              this.usuarioServicio.cadenaConexion = temp[4];
              //console.log('pages CADENA: ', this.usuarioServicio.cadenaConexion)
              this.cargarDatosIniciales();
            }
          }
        }
      );
  }

  urlKiosko() {
    let urltemp = this.usuarioServicio.getUrl();
    return urltemp
  }

  updateDatosUrl() {
    this.urlValidacion = this.urlKiosko();
    if (this.usuarioServicio.urlKioscoDomain != this.urlValidacion) {
      //console.log('la url es di')
      this.usuarioServicio.urlKioscoDomain = this.urlValidacion
      //const sesion = this.usuarioServicio.getUserLoggedIn();
      //this.usuarioServicio.setUrlKiosco(sesion['urlKiosco']);
    }
  }

  cargarDatosIniciales() {
    this.consultarDiasProvisionados();
    this.consultarDatosGraficas();
    this.getProverbios();
    this.cargarNotificaciones();
    this.cargarUltimosPagos();
    this.cargarProvisiones();
  }

  consultarDatosGraficas() {
    // dias provisionados
    let diasProv: string = "";
    this.vacacionesService
      .getDiasVacacionesProvisionadas(
        this.usuarioServicio.usuario,
        this.usuarioServicio.empresa,
        this.usuarioServicio.cadenaConexion
      )
      .subscribe((data) => {
        diasProv = data.toString();
        //console.log("diasProv", data);
        this.polarAreaChartData.push(parseInt(diasProv, 0));
      });

    // obtener dias de novedades de vacaciones
    this.vacacionesService
      .getDiasNovedadesVaca(
        this.usuarioServicio.empresa,
        this.usuarioServicio.usuario,
        this.usuarioServicio.cadenaConexion
      )
      .subscribe((data) => {
        this.totalDiasVacacionesSubtipo = data;
        let diasEnv = data;
        //console.log("DiasEnv", data);
        this.polarAreaChartData.push(parseInt(diasEnv[0][2], 0));
        this.polarAreaChartData.push(parseInt(diasEnv[1][2], 0));
        this.polarAreaChartData.push(parseInt(diasEnv[2][2], 0));
      });
  }

  crearFormulario() {
    this.formulario = this.fb.group(
      {
        mensaje: ["", Validators.required]
      }
    );
  }

  consultarDiasProvisionados() {
    // consultar total dias provisionados
    this.vacacionesService
      .getDiasVacacionesProvisionadas(
        this.usuarioServicio.usuario,
        this.usuarioServicio.empresa,
        this.usuarioServicio.cadenaConexion
      )
      .subscribe((data) => {
        this.totalDiasVacacionesProv = data;
        //console.log(" totalDiasVacacionesProv ", data);
      });
  }

  abrirModal() {
    $("#staticBackdrop").modal("show");
  }

  sumaDias(num1: string, num2: string) {
    const numero1: number = parseFloat(num1);
    const numero2: number = parseFloat(num2);
    //return Math.ceil(numero1+numero2);
    return Math.round(numero1 + numero2);
  }

  enviarReporteNovedad() {
    //console.log('enviar', this.formulario.controls);
    if (this.formulario.valid) {
      swal.fire({
        title: "Enviando mensaje al área de nómina y RRHH, por favor espere...",
        onBeforeOpen: () => {
          swal.showLoading();
          this.usuarioServicio.enviaCorreoNovedadRRHH(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.formulario.get('mensaje').value,
            'Solicitud para Corrección de información', this.usuarioServicio.urlKioscoDomain, this.usuarioServicio.grupoEmpresarial, this.usuarioServicio.cadenaConexion)
            .subscribe(
              (data) => {
                //console.log(data);
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
                      this.formulario.get('mensaje').setValue('');
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
                      this.formulario.get('mensaje').setValue('');
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
                    this.formulario.get('mensaje').setValue('');
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

  getProverbios(){
    if (this.usuarioServicio.listProverbios == null) {
      this.usuarioServicio
      .getProverbios(
        this.usuarioServicio.cadenaConexion,
        this.usuarioServicio.empresa
      )
      .subscribe((data:Array<string>) => {
        //console.log("getProverbios ", data);
        //this.listProverbios = data[ Math.floor(Math.random()*data.length)];
        this.usuarioServicio.listProverbios = data[ Math.floor(Math.random()*data.length)];
        //console.log('this.listProverbios', this.listProverbios);
        
      }); 
    } 
    //this.proverbio=this.listProverbios[ Math.floor(Math.random()*this.listProverbios.length)];    
  }

  cargarNotificaciones() {
    this.usuarioServicio.loadAllNotifications();
   }

   

   cargarUltimosPagos() {
    this.usuarioServicio.getUltimosPagos(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
      .subscribe(
        data => {
          // console.log('getUltimosPagos: ', data);
          let temp: any = data;
          let tempDatos: any = [];
          let tempLabel: any = [];
          let temNumeroDec: any =[];
          let tempChartLabels: any = [];
          for (let i = 0; i < temp.length; i++) {
            //this.lineChartData.push({ data: temp[i][9]});
            //this.polarAreaChartData.push(parseInt(diasEnv[0][2], 0));
            tempDatos.push(parseInt(temp[i][3])/1000000);
             temNumeroDec = tempDatos.map(a => a.toFixed(3))  ;
            
            tempLabel.push(temp[i][2]);
            tempChartLabels.push(temp[i][3]);
            this.lineChartLabels.push(temp[i][1]);

            // console.log('temNumeroDec', temNumeroDec);
            
          }
          //console.log('lineChartData3',this.lineChartData);
          //this.lineChartData = [{ data: tempDatos, label: 'Neto de Nómina'}];
          this.lineChartData = [{ data: temNumeroDec , label: 'Neto de Nómina'}];
          //this.lineChartLabels.push(tempChartLabels);
          // console.log('lineChartData1',this.lineChartLabels);
          // console.log('lineChartData2',this.lineChartData);
          //console.log('lineChartLabels ',  this.lineChartLabels);
          //console.log('lineChartLabels.length ', this.lineChartLabels.length);
          
        });
   }

   cargarProvisiones(){
     this.usuarioServicio.getProvisiones(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
     .subscribe(
       (data :Array<string>) =>{
        //  console.log(data);
         
         this.usuarioServicio.provisiones=data;
         this.prima= this.usuarioServicio.provisiones[2][1];
         this.cesantias= this.usuarioServicio.provisiones[0][1];
         this.interCesantias= this.usuarioServicio.provisiones[1][1];
         this.vacaciones= this.usuarioServicio.provisiones[3][1];
       }
     )
   }

   descargarReporte() {

    let nombreArchivo='kioCertificacionProvisiones';
    let envioCorreo= false
 
    /*console.log(
      "this.usuarioServicio.secuenciaEmpleado: " +
        this.usuarioServicio.secuenciaEmpleado
    );*/
    swal.fire({
      title: "Generando reporte, por favor espere...",
      onBeforeOpen: () => {
        swal.showLoading();
        //console.log("descargarReporte");
        this.reporteServicio
          .generarReporteprovisiones(
            
            nombreArchivo,
            this.usuarioServicio.empresa,
            this.usuarioServicio.cadenaConexion,
            this.usuarioServicio.usuario,
            //this.correo,
          )
          .subscribe(
            (res) => {
              //console.log(res);
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
              //return;
              ///}
              // For other browsers:
              // Create a link pointing to the ObjectURL containing the blob.
              const data = window.URL.createObjectURL(newBlob);
              const link = document.createElement("a");
              link.href = data;
              let f = new Date();
              link.download =
              nombreArchivo+
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
