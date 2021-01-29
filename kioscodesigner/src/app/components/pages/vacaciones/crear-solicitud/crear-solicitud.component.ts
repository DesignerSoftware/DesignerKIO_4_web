import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VacacionesService } from 'src/app/services/vacaciones.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: "app-crear-solicitud",
  templateUrl: "./crear-solicitud.component.html",
  styleUrls: ["./crear-solicitud.component.css"],
})
export class CrearSolicitudComponent implements OnInit {
  formulario: FormGroup;
  public ultimoPeriodo = null;
  public periodosPendientes = null;
  public diasUltimoPeriodo = null;
  public totalDiasVacacionesProv = null; // días provisionados
  public totalDiasVacacionesSolici = null; // días provisionados
  public totalDiasVacacionesLiquidados = null; // días provisionados
  public totalDiasVacacionesRechazados = null; // días provisionados
  public totalDiasVacacionesSubtipo = null; // días provisionados
  public array = [];
  public campoFechaInicioValido = false;
  public mensajeValidacionFechaInicio = "";
  public vacacion = null;

  constructor(
    private vacacionesService: VacacionesService,
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.crearFormulario();
    // consultar todos los periodos de vacaciones y sus correspondientes dias
    this.vacacionesService
      .getPeriodosvacacionesPendientes(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        this.usuarioService.cadenaConexion
      )
      .subscribe((data) => {
        this.periodosPendientes = data;
        console.log(" periodosPendientes ", data);
      });

    // consultar el periodo de vacaciones más antiguo
    this.vacacionesService
      .getUltimoPeriodoVacacionesPendientes(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        this.usuarioService.cadenaConexion
      )
      .subscribe((data) => {
        if (data && data[0]) {
          this.ultimoPeriodo = data[0]["periodoCausado"];
          this.creaListaDias();
        } else {
          this.ultimoPeriodo = "No hay periodos disponibles";
        }
        console.log(" ultimoPeriodo ", this.ultimoPeriodo);
        this.vacacion = data[0]["rfVacacion"];
        console.log("rfVacacion", this.vacacion);
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
        console.log("dias ultimo periodo vacaciones: ", this.diasUltimoPeriodo);
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
        console.log(" totalDiasVacacionesProv ", data);
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
        console.log(" totalDiasVacacionesSolicitados ", data);
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
        console.log(" totalDiasVacacioneLiquidados ", data);
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
        console.log(" totalDiasVacacionesRechazados ", data);
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
          console.log(" totalDiasVacaciones en dinero", data);
        },
        (error) => {
          console.log("se ha presentado un error: " + error);
        }
      );
  }

  crearFormulario() {
    console.log("crearFormulario()");
    this.formulario = this.fb.group({
      fechainicio: [, Validators.required],
      dias: [, Validators.required],
      fechafin: [, Validators.required],
      fecharegreso: [, Validators.required],
      tipo: ["TIEMPO", Validators.required],
      periodo: [],
    });
  }

  public creaListaDias() {
    this.array = [];
    for (let i = 1; i <= this.diasUltimoPeriodo; i++) {
      this.array.push(i);
    }
    return this.array;
  }

  calcularFechasSolicitud() {
    console.log("calcula fecha regreso");
    let diasASolicitar: number = this.formulario.get("dias").value;
    console.log("dias a solicitar: ", diasASolicitar);
    const fechaInicioVacaciones: Date = new Date(
      this.formulario.get("fechainicio").value
    );
    this.vacacionesService
      .calculaFechasSolicitud(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        this.formulario.get("fechainicio").value,
        diasASolicitar.toString()
      )
      .subscribe((data) => {
        console.log("fecha a regresar: " + data);
        this.formulario.get("fechafin").setValue(data[0][0]);
        this.formulario.get("fecharegreso").setValue(data[0][1]);
      });
  }

  validaFecha() {
    console.log("validaFecha ", this.formulario.get("fechainicio").value);
    let fechaInicio = this.formatoddmmyyyy(
      this.formulario.get("fechainicio").value
    );
    console.log("validaFecha parseada ", fechaInicio);
    this.vacacionesService
      .validaFechaInicio(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        fechaInicio
      )
      .subscribe((data) => {
        console.log("validaFecha: ", data["valido"]);
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
    console.log(this.formulario.get("dias").errors);
    if (this.formulario.get("dias").errors) {
      this.formulario.get("fechafin").setValue("");
      this.formulario.get("fecharegreso").setValue("");
    } else {
      this.calcularFechasSolicitud();
    }
  }

  enviarSolicitud() {
    console.log(" formulario valido", this.formulario.valid);
    console.log("Valores: ", this.formulario.controls);
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
              console.log("enviar solicitud");
              console.log(
                "ruta Kiosco: " + this.usuarioService.urlKioscoDomain
              );
              console.log(
                "grupoEmpresarial: " + this.usuarioService.grupoEmpresarial
              );
              /*let fechainicio = this.formatoddmmyyyy(this.formulario.get('fechainicio').value);
            this.vacacionesService.crearSolicitudVacaciones(this.usuarioService.usuario, this.usuarioService.empresa, 'ENVIADO', fechainicio,
            this.formulario.get('fecharegreso').value, this.formulario.get('dias').value, this.vacacion, this.usuarioService.cadenaConexion)
            .subscribe(
              data => {
                console.log(data);
              }
            )*/
              swal.fire({
                title: "Enviando la solicitud al sistema, por favor espere...",
                onBeforeOpen: () => {
                  swal.showLoading();
                  let fechainicio = this.formatoddmmyyyy(
                    this.formulario.get("fechainicio").value
                  );
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
                      this.formulario.get('fechafin').value
                    )
                    .subscribe(
                      (data) => {
                        console.log(data);
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
          });
      } else {
        console.log(this.formulario.controls);
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
}
