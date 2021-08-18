import { Component, OnInit, Injectable, Input } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { Router } from '@angular/router';
import { VacacionesService } from 'src/app/services/vacaciones.service';
import { Label } from 'ng2-charts';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ChartOptions, ChartType } from 'chart.js';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


@Injectable()
export class HomeComponent implements OnInit {
  @Input() urlLogoEmpresaDarkXl = 'assets/images/fotos_empleados/logodesigner-dark-xl.png'; // recibe valor de pages.component
  totalDiasVacacionesProv: any = "...";
  public totalDiasVacacionesSubtipo = null;
  formulario: FormGroup;

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
  public polarAreaChartData: number[] = [];
  public polarAreaLegend = true;

  constructor(private fb: FormBuilder, public usuarioServicio: UsuarioService, private router: Router, private cadenasKioskos: CadenaskioskosappService,
    private opcionesKioskosService: OpcionesKioskosService, private vacacionesService: VacacionesService, private usuarioService: UsuarioService) {
      if (this.usuarioServicio.empresa==''){

      }
    console.log('constructor home');
  }


  ngOnInit() {
    console.log('ngOnInit home');
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
    console.log('usuario: ' + this.usuarioServicio.usuario + ' empresa: ' + this.usuarioServicio.empresa);
    this.cadenasKioskos.getCadenaKioskoXGrupoNit(sesion['grupo'], sesion['empresa'])
    .subscribe(
      data => {
        console.log('getInfoUsuario', data);
        console.log(sesion['grupo']);
        for (let i in data) {
          if (data[i][3] === sesion['grupo']) { // GRUPO
          const temp = data[i];
          console.log('cadena: ', temp[4]) // CADENA
          this.usuarioServicio.cadenaConexion=temp[4];
          console.log('pages CADENA: ', this.usuarioServicio.cadenaConexion)
          this.cargarDatosIniciales();
          }
        }
      }
    );
  }

  cargarDatosIniciales() {
    this.consultarDiasProvisionados();
    this.consultarDatosGraficas();
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
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        this.usuarioService.cadenaConexion
      )
      .subscribe((data) => {
        this.totalDiasVacacionesProv = data;
        //console.log(" totalDiasVacacionesProv ", data);
      });
  }

  abrirModal() {
    $("#staticBackdrop").modal("show");
  }

  sumaDias(num1: string, num2: string){
    const numero1: number = parseFloat(num1);
    const numero2: number = parseFloat(num2);
    //return Math.ceil(numero1+numero2);
    return Math.round(numero1+numero2);
  }

  enviarReporteNovedad() {
    //console.log('enviar', this.formulario.controls);
    if (this.formulario.valid) {
      swal.fire({
        title: "Enviando mensaje al área de nómina y RRHH, por favor espere...",
        onBeforeOpen: () => {
          swal.showLoading();
          this.usuarioService.enviaCorreoNovedadRRHH(this.usuarioService.usuario, this.usuarioService.empresa, this.formulario.get('mensaje').value,
            'Solicitud para Corrección de información', this.usuarioService.urlKioscoDomain, this.usuarioService.grupoEmpresarial, this.usuarioServicio.cadenaConexion)
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
}
