import swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VacacionesService } from 'src/app/services/vacaciones.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { AusentismosService } from 'src/app/services/ausentismos.service';
import { data } from 'jquery';
import * as moment from 'moment';

@Component({
  selector: "app-crear-solicitud",
  templateUrl: "./crear-solicitud.component.html",
  styleUrls: ["./crear-solicitud.component.css"],
})
export class CrearSolicitudComponent implements OnInit {
  formulario: FormGroup;
  formularioReporteNov: FormGroup;
  public ultimoPeriodo = null;
  public periodosPendientes = null;
  public diasUltimoPeriodo = null;
  public totalDiasVacacionesProv = null; // días provisionados
  public totalDiasVacacionesSolici = null;
  public totalDiasVacacionesLiquidados = null;
  public totalDiasVacacionesRechazados = null;
  public totalDiasVacacionesSubtipo = null;
  public array = [];
  public campoFechaInicioValido = false;
  public mensajeValidacionFechaInicio = "";
  public vacacion = null;
  public autorizadorVacaciones = '...';
  estadoNovEmple = null;
  msjNovEmpleTitle = null;
  msjNovEmpleDetalle = null;

  constructor(
    private vacacionesService: VacacionesService,
    public usuarioService: UsuarioService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cadenasKioskos: CadenaskioskosappService,
    public ausentismosService: AusentismosService
  ) { }

  ngOnInit() {
    this.crearFormulario();
    if (this.usuarioService.cadenaConexion) {
      this.cargarDatosIniciales();
    } else {
      this.getInfoUsuario();
    }
  }

  crearFormulario() {
    //console.log("crearFormulario()");
    this.formulario = this.fb.group({
      fechainicio: [, Validators.required],
      fechainiciodt: [,],
      dias: [, Validators.required],
      fechafin: [, Validators.required],
      fecharegreso: [, Validators.required],
      tipo: ["TIEMPO", Validators.required],
      periodo: [],
    });

    this.formularioReporteNov = this.fb.group(
      {
        mensaje: ["", Validators.required]
      }
    );
  }

  getInfoUsuario() { // obtener la información del usuario del localStorage y guardarla en el service
    const sesion = this.usuarioService.getUserLoggedIn();
    this.usuarioService.setUsuario(sesion['usuario']);
    this.usuarioService.setEmpresa(sesion['empresa']);
    this.usuarioService.setTokenJWT(sesion['JWT']);
    this.usuarioService.setGrupo(sesion['grupo']);
    this.usuarioService.setUrlKiosco(sesion['urlKiosco']);
    //console.log('usuario: ' + this.usuarioService.usuario + ' empresa: ' + this.usuarioService.empresa);
    this.cadenasKioskos.getCadenaKioskoXGrupoNit(sesion['grupo'], sesion['empresa'])
      .subscribe(
        data => {
          //console.log('getInfoUsuario', data);
          //console.log(sesion['grupo']);
          for (let i in data) {
            if (data[i][3] === sesion['grupo']) { // GRUPO
              const temp = data[i];
              //console.log('cadena: ', temp[4]) // CADENA
              this.usuarioService.cadenaConexion = temp[4];
              //console.log('pages CADENA: ', this.usuarioService.cadenaConexion)
              this.cargarDatosIniciales();
            }
          }
        }
      );
  }

  cargarDatosIniciales() {
    // consultar todos los periodos de vacaciones y sus correspondientes dias
    this.vacacionesService
      .getPeriodosvacacionesPendientes(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        this.usuarioService.cadenaConexion
      )
      .subscribe((data) => {
        this.periodosPendientes = data;
        //console.log(" periodosPendientes ", data);
      });

    // consultar el periodo de vacaciones más antiguo
    this.vacacionesService
      .getUltimoPeriodoVacacionesPendientes(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        this.usuarioService.cadenaConexion
      )
      .subscribe((data) => {
        console.log("periodo: ", data);
        if (data && data[0]) {
          this.ultimoPeriodo = data[0][1];
          this.creaListaDias();
        } else {
          this.ultimoPeriodo = "No hay periodos disponibles";
        }
        // console.log(" ultimoPeriodo ", this.ultimoPeriodo);
        //this.vacacion = data[0]["rfVacacion"];
        this.vacacion = data[0][0];
        //console.log("rfVacacion", this.vacacion);
      });

    // Consultar dias disponibles para solicitar ultimo periodo
    this.vacacionesService
      .getDiasUltimoPeriodoVacacionesPendientes(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        this.usuarioService.cadenaConexion
      )
      .subscribe((data) => {
        this.diasUltimoPeriodo = data;
        //console.log("dias ultimo periodo vacaciones: ", this.diasUltimoPeriodo);
        if (this.diasUltimoPeriodo == 0) {
          this.formulario.get("dias").setErrors({ noDiasDispo: true });
        } else {
          this.creaListaDias();
        }
      });

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

    // consultar total de dias de vacaciones solicitados
    this.vacacionesService
      .getTotalDiasSolicitados(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        this.usuarioService.cadenaConexion
      )
      .subscribe((data) => {
        this.totalDiasVacacionesSolici = data;
        //console.log(" totalDiasVacacionesSolicitados ", data);
      });

    // consultar total de dias de vacaciones con ultimo estado AUTORIZADO
    this.vacacionesService
      .getTotalDiasSolicitadosXUltimoEstado(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        this.usuarioService.cadenaConexion,
        "LIQUIDADO"
      )
      .subscribe((data) => {
        this.totalDiasVacacionesLiquidados = data;
        //console.log(" totalDiasVacacioneLiquidados ", data);
      });

    // consultar total de dias de vacaciones con ultimo estado RECHAZADO
    this.vacacionesService
      .getTotalDiasSolicitadosXUltimoEstado(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        this.usuarioService.cadenaConexion,
        "RECHAZADO"
      )
      .subscribe((data) => {
        this.totalDiasVacacionesRechazados = data;
        //console.log(" totalDiasVacacionesRechazados ", data);
      });

    this.vacacionesService
      .getDiasNovedadesVaca(
        this.usuarioService.empresa,
        this.usuarioService.usuario,
        this.usuarioService.cadenaConexion
      )
      .subscribe(
        (data) => {
          this.totalDiasVacacionesSubtipo = data;
          //console.log(" totalDiasVacaciones en dinero", data);
        },
        (error) => {
          //console.log("se ha presentado un error: " + error);
        }
      );

    // Consultar autorizador de vacaciones
    this.vacacionesService
      .getAutorizadorVacaciones(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        this.usuarioService.cadenaConexion
      )
      .subscribe(
        (data) => {
          //console.log('Autorizador vacaciones: ', data['resultado']);
          this.autorizadorVacaciones = data['resultado'];
        },
        (error) => {
          console.log("se ha presentado un error al consultar autorizador vacaciones: " + JSON.stringify(error.statusText));
        }
      );
  }

  sumaDias(num1: string, num2: string) {
    const numero1: number = parseFloat(num1);
    const numero2: number = parseFloat(num2);
    //return Math.ceil(numero1+numero2);
    return Math.round(numero1 + numero2);
  }

  validaFechaNovedadEmpleadoXJefe() {
    this.ausentismosService.getvalidaFechaNovedadEmpleadoXJefe(this.usuarioService.empresa, this.usuarioService.usuario, this.formatoddmmyyyy(this.formulario.get('fechainicio').value), this.usuarioService.cadenaConexion)
      .subscribe(
        data => {
          //console.log(data);
          this.estadoNovEmple = data['valida'];
          if (this.estadoNovEmple == 'KSA') {
            this.msjNovEmpleTitle = '¡Rango de fechas no válido!';
            this.msjNovEmpleDetalle = 'Tienes una novedad de ausentismo en ese rango de fechas';
          }
          else if (this.estadoNovEmple == 'SA') {
            this.msjNovEmpleTitle = '¡Rango de fechas no válido!';
            this.msjNovEmpleDetalle = 'La fechas coinciden con otra novedad de ausentismo. Por favor validarlo con el área de nómina y recursos humanos de su empresa.';
          } else if (this.estadoNovEmple == 'SV') {
            this.msjNovEmpleTitle = '¡Rango de fechas no válido!';
            this.msjNovEmpleDetalle = 'La fecha de vacaciones coincide con una solicitud de vacaciones ya reportada';
          } else {
            this.msjNovEmpleTitle = '';
            this.msjNovEmpleDetalle = '';
          }
          ;
          /*console.log('impresive', this.ausentismoService.SolicitudesJefe);
         //console.log<("Datos iniciales");
          console.log(data);*/
        }
      );
  }

  public creaListaDias() {
    this.array = [];
    for (let i = 1; i <= this.diasUltimoPeriodo; i++) {
      this.array.push(i);
    }
    return this.array;
  }

  calcularFechasSolicitud() {
    //console.log("calcula fecha regreso");
    let diasASolicitar: number = this.formulario.get("dias").value;
    //console.log("dias a solicitar: ", diasASolicitar);
    const fechaInicioVacaciones: Date = new Date(
      this.formulario.get("fechainicio").value
    );
    this.vacacionesService
      .calculaFechasSolicitud(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        this.formulario.get("fechainicio").value,
        diasASolicitar.toString(),
        this.usuarioService.cadenaConexion
      )
      .subscribe((data) => {
        // console.log(data);
        // console.log(this.formatommddyyyy(data[0][0]).toString());
        // console.log(this.formatommddyyyy(data[0][1]));
        // console.log("fecha a regresar: " + data);
        /*this.formulario.get("fechafin").setValue(data[0][0]);
        this.formulario.get("fecharegreso").setValue(data[0][1]);*/

        this.formulario.get("fechafin").setValue(data[0][0]);
        this.formulario.get("fecharegreso").setValue(data[0][1]);
        this.asigFecha();
      });
  }

  validaFecha() {
    //console.log("validaFecha ", this.formulario.get("fechainicio").value);
    let fechaInicio = this.formatoddmmyyyy(
      this.formulario.get("fechainicio").value
    );
    //console.log("validaFecha parseada ", fechaInicio);
    this.vacacionesService
      .validaFechaInicio(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        fechaInicio, this.usuarioService.cadenaConexion
      )
      .subscribe((data) => {
        //console.log("validaFecha: ", data["valido"]);
        if (data["valido"]) {
          this.campoFechaInicioValido = true;
          this.mensajeValidacionFechaInicio = "";
          this.actualizaCampos();
        } else {
          this.campoFechaInicioValido = false;
          this.mensajeValidacionFechaInicio = data["mensaje"];
          this.formulario.get("fechainicio").setErrors({ noValido: true });
          swal.fire({
            icon: "error",
            title: "¡Por favor verifique la fecha de inicio!",
            text: data["mensaje"],
            showConfirmButton: true,
          });
          this.formulario.get("fechafin").setValue("");
          this.formulario.get("fecharegreso").setValue("");
        }
      });
  }

  actualizaCampos() {
    //console.log(this.formulario.get("dias").errors);
    if (this.formulario.get("dias").errors) {
      this.formulario.get("fechafin").setValue("");
      this.formulario.get("fecharegreso").setValue("");
    } else {
      this.calcularFechasSolicitud();
    }
  }

  enviarSolicitud() {
    //console.log("urlKioscoDomain"  , this.usuarioService.urlKioscoDomain);
    //console.log(" formulario valido", this.formulario.valid);
    //console.log("Valores: ", this.formulario.controls);
    //console.log('refVacacion ' , this.vacacion);
    Object.values(this.formulario.controls).forEach((control) => {
      control.markAsTouched();
    });
    if (this.formulario.valid) {
      if (!this.campoFechaInicioValido) {
        swal.fire({
          title: "¡Por favor valide la fecha de inicio!",
          text: this.mensajeValidacionFechaInicio,
          icon: "error",
        });
      } else if (this.formulario.valid) {
        this.validaFechaNovedadEmpleadoXJefe();
        swal
          .fire({
            title: "Confirmación",
            text: "¿Esta seguro(a) de que desea enviar la solicitud?",
            icon: "info",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Aceptar",
            showCancelButton: true,
          })
          .then((result) => {
            if (result.value) {
              //console.log("enviar solicitud");
              /*console.log(
                "ruta Kiosco: " + this.usuarioService.urlKioscoDomain
              );
              console.log(
                "grupoEmpresarial: " + this.usuarioService.grupoEmpresarial
              );*/
              /*let fechainicio = this.formatoddmmyyyy(this.formulario.get('fechainicio').value);
            this.vacacionesService.crearSolicitudVacaciones(this.usuarioService.usuario, this.usuarioService.empresa, 'ENVIADO', fechainicio,
            this.formulario.get('fecharegreso').value, this.formulario.get('dias').value, this.vacacion, this.usuarioService.cadenaConexion)
            .subscribe(
              data => {
                console.log(data);
              }
            )*/
              if (this.estadoNovEmple == 'KSA' || this.estadoNovEmple == 'SA' || this.estadoNovEmple == 'SV') {
                swal.fire({
                  title: this.msjNovEmpleTitle,
                  text: this.msjNovEmpleDetalle,
                  icon: 'warning',
                }).then(() => {
                  this.router.navigate(['/vacaciones']);
                });
              } else {
                swal.fire({
                  title: "Enviando la solicitud al sistema, por favor espere...",
                  onBeforeOpen: () => {
                    swal.showLoading();
                    let fechainicio = this.formatoddmmyyyy(
                      this.formulario.get("fechainicio").value
                    );
                    /*let fecharegreso = this.formatoddmmyyyy(
                      this.formulario.get("fecharegreso").value
                    );
                    let fechafin = this.formatoddmmyyyy(
                      this.formulario.get("fechafin").value
                    );*/
                    this.vacacionesService
                      .crearSolicitudVacaciones(
                        this.usuarioService.usuario,
                        this.usuarioService.empresa,
                        'ENVIADO',
                        fechainicio,
                        this.formulario.get("fecharegreso").value,
                        this.formulario.get("dias").value,
                        this.vacacion,
                        this.usuarioService.cadenaConexion,
                        this.usuarioService.urlKioscoDomain,
                        this.usuarioService.grupoEmpresarial,
                        this.formulario.get("fechafin").value
                      )
                      .subscribe(
                        (data) => {
                          //console.log(data);
                          if (data["solicitudCreada"]) {
                            swal
                              .fire({
                                icon: "success",
                                title:
                                  "Solicitud de vacaciones creada exitosamente",
                                showConfirmButton: true,
                              })
                              .then((res) => {
                                this.router.navigate(["/vacaciones"]);
                              });
                          } else {
                            swal
                              .fire({
                                icon: "error",
                                title: data["mensaje"],
                                showConfirmButton: true,
                              })
                              .then((res) => {
                                this.router.navigate(["/vacaciones"]);
                              });
                          }
                        },
                        (error) => {
                          swal
                            .fire({
                              icon: "error",
                              title: "Ha ocurrido un error al crear la solicitud",
                              text:
                                "Por favor inténtelo de nuevo más tarde. Si el error persiste contáctese con el área de nómina y recursos humanos de su empresa.",
                              showConfirmButton: true,
                            })
                            .then((res) => {
                              this.router.navigate(["/vacaciones"]);
                            });
                        }
                      );
                  },
                  allowOutsideClick: () => !swal.isLoading(),
                });
              }
            }
          });
      } else {
        //console.log(this.formulario.controls);
        swal.fire({
          title: "¡Por favor valide el formulario!",
          text:
            "Verifique que los campos de fecha de inicio y total de dias a solicitar no estén vacios",
          icon: "error",
        });
      }
    }
  }

  formatoddmmyyyy(fecha) {
    let anio = fecha.substring(0, 4);
    let mes = fecha.substring(5, 7);
    let dia = fecha.substring(8, 11);
    let ensamble = dia + "/" + mes + "/" + anio;
    return ensamble;
  }

  formatommddyyyy(fecha) {
    //console.log(fecha);
    var momentVariable = moment(fecha, 'DD/MM/YYYY');
    var stringvalue = momentVariable.format('YYYY-MM-DD');
    //console.log(stringvalue); // outputs 2018-08-25  
    return stringvalue;
  }

  abrirModal() {
    $("#staticBackdropEJ").modal("show");
  }

  /*Método que envia el correo de notificación de corrección de información*/
  enviarReporteNovedad() {
    //console.log('dominio ' , this.usuarioService.urlKioscoDomain)
    //console.log('enviar', this.formularioReporteNov.controls);
    if (this.formularioReporteNov.valid) {
      swal.fire({
        title: "Enviando mensaje al área de nómina y RRHH, por favor espere...",
        onBeforeOpen: () => {
          swal.showLoading();
          this.usuarioService.enviaCorreoNovedadRRHH(this.usuarioService.usuario, this.usuarioService.empresa, this.formularioReporteNov.get('mensaje').value,
            'Solicitud de Corrección Jefe Inmediato', this.usuarioService.urlKioscoDomain, this.usuarioService.grupoEmpresarial, this.usuarioService.cadenaConexion)
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
                      $("#staticBackdropEJ").modal("hide");
                      this.formularioReporteNov.get('mensaje').setValue('');
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
                      $("#staticBackdropEJ").modal("hide");
                      this.formularioReporteNov.get('mensaje').setValue('');
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
                    $("#staticBackdropEJ").modal("hide");
                    this.formularioReporteNov.get('mensaje').setValue('');
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

  // 211019 dar formato a fecha 
  asigFecha() {
    let datetemp = this.formatoddmmyyyy(this.formulario.get('fechainicio').value);
    //console.log('fecha: ' , datetemp)
    this.formulario.get("fechainiciodt").setValue(datetemp);
    document.getElementById("fechainiciodt").hidden = false;
    document.getElementById("fechainicio").hidden = true;
  }

  backDt() {
    //console.log("prueba1()");
    document.getElementById("fechainiciodt").hidden = true;
    document.getElementById("fechainicio").hidden = false;
  }

  backText() {
    //console.log("prueba2()");
    document.getElementById("fechainiciodt").hidden = false;
    document.getElementById("fechainicio").hidden = true;
  }

}
