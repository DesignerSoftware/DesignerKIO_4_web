import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VacacionesService } from 'src/app/services/vacaciones.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-home2',
  templateUrl: './home2.component.html',
  styleUrls: ['./home2.component.scss']
})
export class Home2Component implements OnInit {

  @Input() urlLogoEmpresaDarkXl = '/assets/images/fotos_empleados/logodesigner-dark-xl.png'; // recibe valor de pages.component
  totalDiasVacacionesProv: any = "...";
  totalDiasVacacionesPeriodosCumplidos: any = "...";
  public totalDiasVacacionesSubtipo: any = null;
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
      data: [0, 0, 0, 0],
      label: 'Vacaciones'
    }]
  };
  polarAreaChartOptions: ChartConfiguration['options'] = {};
  //Fin estructuras para grafica radial

  constructor(private fb: FormBuilder, public usuarioServicio: UsuarioService, private router: Router, private cadenasKioskos: CadenaskioskosappService,
    private opcionesKioskosService: OpcionesKioskosService, private vacacionesService: VacacionesService, private usuarioService: UsuarioService) {
    console.log('constructor home2');
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

  // obtener la información del usuario del localStorage y guardarla en el service
  getInfoUsuario() {
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

  cargarDatosIniciales() {
    this.consultarDiasProvisionados();
    this.consultarDiasVacacionesPerCumplidos();
    this.consultarDatosGraficas();
  }

  // dias provisionados
  consultarDatosGraficas() {
    let diasProv: string = "";
    this.vacacionesService
      .getDiasVacacionesProvisionadas(
        this.usuarioServicio.usuario,
        this.usuarioServicio.empresa,
        this.usuarioServicio.cadenaConexion
      )
      .subscribe((data: any) => {
        diasProv = data.toString();
        //this.polarAreaChartData.push(parseInt(diasProv, 0));
        this.polarAreaChartData.datasets[0].data[0] = parseInt(diasProv, 0);
      });

    // obtener dias de novedades de vacaciones
    this.vacacionesService
      .getDiasNovedadesVaca(
        this.usuarioServicio.empresa,
        this.usuarioServicio.usuario,
        this.usuarioServicio.cadenaConexion
      )
      .subscribe((data: any) => {
        this.totalDiasVacacionesSubtipo = data;
        let diasEnv = data;
        /*
        this.polarAreaChartData.push(parseInt(diasEnv[0][2], 0));
        this.polarAreaChartData.push(parseInt(diasEnv[1][2], 0));
        this.polarAreaChartData.push(parseInt(diasEnv[2][2], 0));
        */
        this.polarAreaChartData.datasets[0].data[1] = parseInt(diasEnv[0][2], 0);
        this.polarAreaChartData.datasets[0].data[2] = parseInt(diasEnv[1][2], 0);
        this.polarAreaChartData.datasets[0].data[3] = parseInt(diasEnv[2][2], 0);
      });
  }

  crearFormulario() {
    this.formulario = this.fb.group(
      {
        mensaje: ["", Validators.required]
      }
    );
  }

  // consultar total dias provisionados
  consultarDiasProvisionados() {
    this.vacacionesService
      .getDiasVacacionesProvisionadas(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        this.usuarioService.cadenaConexion
      )
      .subscribe((data: any) => {
        this.totalDiasVacacionesProv = data;
      });
  }

  // consultar total dias provisionados
  consultarDiasVacacionesPerCumplidos() {
    this.vacacionesService
      .getDiasVacacionesPeriodosCumplidos(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        this.usuarioService.cadenaConexion
      )
      .subscribe((data) => {
        this.totalDiasVacacionesPeriodosCumplidos = data;
      });
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
          this.usuarioService.enviaCorreoNovedadRRHH(this.usuarioService.usuario, this.usuarioService.empresa, this.formulario.get('mensaje')!.value,
            'Solicitud para Corrección de información', this.usuarioService.urlKioscoDomain, this.usuarioService.grupoEmpresarial, this.usuarioServicio.cadenaConexion)
            .subscribe(
              (data) => {
                console.log(data);
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

}
