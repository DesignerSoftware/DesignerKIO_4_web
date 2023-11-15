import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AusentismosService } from 'src/app/services/ausentismos.service';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-reportar-ausentismo',
  templateUrl: './reportar-ausentismo.component.html',
  styleUrls: ['./reportar-ausentismo.component.scss']
})
export class ReportarAusentismoComponent implements OnInit {

  formulario: FormGroup = {} as FormGroup;
  formularioReporteNov: FormGroup = {} as FormGroup;
  cadenaProvisional: any = null;
  autorizadorVacaciones: string = '...';
  causasAusentismos: any = null;
  secCodDiagSelec: string = '';
  prorrogaSeleccionada: any = null;
  activaProrroga: boolean = false;
  claseSelec: any = null;
  tipoSelec: any = null;
  habilitaBtnCodDiag: boolean = false;
  estadoNovEmple: any = null;
  msjNovEmpleTitle: string = '';
  msjNovEmpleDetalle: string = '';
  msjValidArchivoAnexo: string = '';
  nomArchivo: any = null;
  _dataFilt: string = '';
  p1: number = 1;
  codigosAusentismos: any = null;
  codigosAusentismosFilt: any = null;
  public configSecond: PaginationInstance = {
    id: 'second',
    itemsPerPage: 8,
    currentPage: 1
  };
  loading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public usuarioService: UsuarioService,
    public ausentismosService: AusentismosService,
    private cadenasKioskos: CadenaskioskosappService,
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
    this.formulario = this.fb.group({
      fechainicio: [, Validators.required],
      fechainiciodt: [,],
      dias: [, [Validators.required]],
      fechafin: [],
      causa: [, Validators.required],
      codigo: [],
      clase: [],
      tipo: [],
      prorroga: [false],
      observaciones: [''],
      anexo: [null, []]
    });

    this.formularioReporteNov = this.fb.group(
      {
        mensaje: ["", Validators.required]
      }
    );
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
              this.cadenaProvisional = temp[4];
              this.cargarDatosIniciales();
            }
          }
        }
      );
  }

  cargarDatosIniciales() {
    this.cargarCausas();
    this.getOpcionesDiagnosticos();
    this.consultarAutorizadorAusentismos();
  }

  consultarAutorizadorAusentismos() {
    // Consultar autorizador de ausentismos
    this.ausentismosService
      .getAutorizadorAusentismos(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        this.usuarioService.cadenaConexion
      )
      .subscribe(
        (data: any) => {
          this.autorizadorVacaciones = data['resultado'];
        },
        (error) => {
        }
      );
  }

  getOpcionesDiagnosticos() {
    //if (!this.ausentismosService.codigosAusentismos || this.ausentismosService.codigosAusentismos == null) {
    this.ausentismosService.getCodigosAusentismos(this.usuarioService.empresa, this.usuarioService.cadenaConexion)
      .subscribe(
        (data: any) => {
          this.codigosAusentismos = data;
          this.ausentismosService.codigosAusentismos = data;
        }
      )
    //}
    console.log('Consulta codigos diagnostico.');
    console.log(this.ausentismosService.codigosAusentismos);
    console.log(this.codigosAusentismos);
  }

  getProrrogas() {
    if (this.formulario.get('causa')!.value != null || this.formulario.get('causa')!.value != '') {
      let indexCausa = this.formulario.get('causa')!.value;
      let secuenciaCausa = this.causasAusentismos[indexCausa].causa.secuencia;
      this.ausentismosService.getProrroga(this.usuarioService.usuario, secuenciaCausa, this.formulario.get('fechainicio')!.value, this.usuarioService.empresa, this.usuarioService.cadenaConexion)
        .subscribe(
          (data: any) => {
            this.ausentismosService.datosProrroga = data;
          }
        )
    } else {
      swal.fire(
        'No ha seleccionado la causa del ausentismo',
        'Para seleccionar una prorroga debe seleccionar primero la causa de ausentismo',
        'error'
      )
    }
  }

  mostrarListaCod() {
    try {
      $("#exampleModal").modal("show");
    } catch (error) {
    }

  }

  // Desplegar ventana para reportar información importante
  abrirModal() {
    $("#exampleModalRN").modal("show");
  }

  enviarReporteNovedad() {
    if (this.formularioReporteNov.valid) {
      swal.fire({
        title: "Enviando mensaje al área de nómina y RRHH, por favor espere...",
        willOpen: () => {
          swal.showLoading();
          this.usuarioService.enviaCorreoNovedadRRHH(this.usuarioService.usuario, this.usuarioService.empresa, this.formularioReporteNov.get('mensaje')!.value,
            'Solicitud de Corrección Jefe Inmediato', this.usuarioService.urlKioscoDomain, this.usuarioService.grupoEmpresarial, this.usuarioService.cadenaConexion)
            .subscribe(
              (data) => {
                if (data) {
                  swal
                    .fire({
                      icon: "success",
                      title:
                        "Mensaje enviado exitosamente al área de nómina y RRHH para su validación.",
                      showConfirmButton: true,
                    })
                    .then((res) => {
                      $("#exampleModalRN").modal("hide");
                      this.formularioReporteNov.get('mensaje')!.setValue('');
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
                      $("#exampleModalRN").modal("hide");
                      this.formularioReporteNov.get('mensaje')!.setValue('');
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
                    $("#exampleModalRN").modal("hide");
                    this.formularioReporteNov.get('mensaje')!.setValue('');
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

  ocultarListaCod() {
    $("#exampleModal").modal("hide");
  }

  seleccionarCodDiag(secuencia: string, codigo: string, descripcion: string, index: number) {
    this.formulario.get('codigo')!.setValue(codigo + " - " + descripcion);
    this.secCodDiagSelec = secuencia;
    this.ocultarListaCod();
  }

  seleccionaPro(index: number) {
    this.formulario.get('fechainicio')!.setValue('');
    if (Array.isArray(this.ausentismosService.datosProrroga)) {
      this.prorrogaSeleccionada = this.ausentismosService.datosProrroga[index];
      this.formulario.get('fechainicio')!.setValue(this.ausentismosService.datosProrroga[index][1]);
    }
    this.cargaFechaFin();
  }

  quitarSeleccionPro() {
    this.prorrogaSeleccionada = null;
    this.formulario.get('fechainicio')!.setValue('');
  }

  validarCheckProrroga() {
    this.formulario.get('fechafin')!.setValue(null);
    if (this.formulario.get('prorroga')!.value == false) {
      this.quitarSeleccionPro();
    } else {
      this.formulario.get('fechainicio')!.setValue('');
    }
  }

  /*Método que se ejecuta cuando se cambia la selección de la causa de ausentismo*/
  cambioSeleccion(): void {
    this.formulario.get('prorroga')!.setValue(false); // Quitar check de prorroga
    this.prorrogaSeleccionada = null; // Quitar la prorroga seleccionada
    let secCausa = this.formulario.get('causa')!.value;
    this.activaProrroga = false;
    this.claseSelec = this.causasAusentismos[secCausa].causa.clase.descripcion;
    this.tipoSelec = this.causasAusentismos[secCausa].causa.clase.tipo.descripcion;
    let descripcionCausa = this.causasAusentismos[secCausa].causa.descripcion;
    if (descripcionCausa.indexOf("ENFERMEDAD") > -1 || this.causasAusentismos[secCausa].causa.clase.tipo.descripcion.indexOf("INCAPACIDAD") > -1) {
      this.habilitaBtnCodDiag = true;
    } else {
      this.habilitaBtnCodDiag = false;
    }
    this.cargaFechaFin();
  }

  validaFechaNovedadEmpleadoXJefe() {
    this.ausentismosService.getvalidaFechaNovedadEmpleadoXJefe(this.usuarioService.empresa, this.usuarioService.usuario,
      this.formulario.get('fechafin')!.value, this.usuarioService.cadenaConexion)
      .subscribe(
        (data: any) => {
          this.estadoNovEmple = data['valida'];
          if (this.estadoNovEmple == 'KSA') {
            this.msjNovEmpleTitle = '¡Rango de fechas no válido!';
            this.msjNovEmpleDetalle = 'Ya reportaste una novedad de ausentismo en ese rango de fechas';
          }
          else if (this.estadoNovEmple == 'SA') {
            this.msjNovEmpleTitle = '¡Rango de fechas no válido!';
            this.msjNovEmpleDetalle = 'La fechas coinciden con otra novedad de ausentismo. Por favor validarlo con el área de nómina y recursos humanos de su empresa.';
          } else if (this.estadoNovEmple == 'SV') {
            this.msjNovEmpleTitle = '¡Rango de fechas no válido!';
            this.msjNovEmpleDetalle = 'La fecha de ausentismo coincide con una novedad de vacaciones';
          } else {
            this.msjNovEmpleTitle = '';
            this.msjNovEmpleDetalle = '';
          }
          ;
        }
      );
  }

  cargarCausas() {
    this.ausentismosService.getCausasEmpresa(this.usuarioService.empresa, this.usuarioService.cadenaConexion)
      .subscribe(
        data => {
          this.causasAusentismos = data;
        }
      )
  }

  cargaFechaFin(): void {
    this.formulario.get('fechafin')!.setValue('');
    let indexCausa = this.formulario.get('causa')!.value;
    let secuenciaCausa = this.causasAusentismos[indexCausa].causa.secuencia;
    if (this.formulario.get('causa')!.value != '' && this.formulario.get('causa')!.value != null
      && this.formulario.get('dias')!.value > 0 && this.formulario.get('dias')!.value != null
      && this.formulario.get('fechainicio')!.value != null && this.formulario.get('fechainicio')!.value != '') {
      this.ausentismosService.getFechaFinAusentismo(this.usuarioService.tokenJWT, this.usuarioService.usuario, this.usuarioService.empresa,
        this.formatoddmmyyyy(this.formulario.get('fechainicio')!.value), this.formulario.get('dias')!.value,
        secuenciaCausa, this.usuarioService.cadenaConexion)
        .subscribe(
          (data: any) => {
            this.formulario.get('fechafin')!.setValue(data['fechafin']);
            this.asigFecha();
          }
        )
    }
  }

  validaFecha() {
    let fechaInicio = this.formatoddmmyyyy(
      this.formulario.get("fechainicio")!.value
    );
    this.ausentismosService
      .validaFechaInicioAusent(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        fechaInicio, this.usuarioService.cadenaConexion
      )
      .subscribe((data: any) => {
        if (data["valido"]) {
          this.cargaFechaFin();
        } else {
          this.formulario.get("fechainicio")!.setErrors({ noValido: true });
          swal.fire({
            icon: "error",
            title: "¡Por favor verifique la fecha de inicio!",
            text: data["mensaje"],
            showConfirmButton: true,
          });
          this.formulario.get("fechafin")!.setValue("");
        }
      });
  }


  enviarNovedad() {
    Object.values(this.formulario.controls).forEach((control: any) => {
      control.markAsTouched();
    });
    this.validaFechaNovedadEmpleadoXJefe();
    if (this.formulario.valid) {
      let indexCausa = this.formulario.get('causa')!.value;
      console.log('codigoCausa', this.causasAusentismos[indexCausa].causa.codigo);
      if (this.formulario.get('dias')!.value <= 0) {
        swal.fire({
          title: "¡Valide la cantidad de días del ausentismo!",
          text: 'La cantidad mínima de días a reportar debe ser 1.',
          icon: "error"
        });
      } else if (this.formulario.get('dias')!.value >= 2 && this.causasAusentismos[indexCausa].causa.codigo === "54") {
        swal.fire({
          title: "¡Ha solicitado mas de un dia familiar.!",
          //text: 'Ha solicitado mas de un dia familiar.',
          icon: "error",
        });
      } else if (this.formulario.get('dias')!.value > 5 && this.causasAusentismos[indexCausa].causa.codigo === "36") {
        swal.fire({
          title: "¡No se pueden solicitar mas de 5 días según el artículo 57 del código sustantivo del trabajo adicionado por la ley 1280 de 2009.!",
          //text: 'Ha solicitado mas de un dia familiar.',
          icon: "error",
        });
      } else if (this.formulario.get('prorroga')!.value && this.prorrogaSeleccionada == null) {
        swal.fire({
          title: "¡Seleccione una prórroga!",
          text: 'Ha seleccionado que esta reportando un ausentismo con prórroga pero no ha indicado a cual hace referencia.',
          icon: "error",
        });
      } else if ((this.formulario.get('anexo')!.value != null && this.formulario.get('anexo')!.value != '') && (!this.validaTipoArchivoAnexo() || !this.validaSizeAnexo())) {
        if (!this.validaSizeAnexo()) {
          swal.fire('Tamaño de archivo demasiado grande', 'Por favor seleccione un archivo de máximo 5MB', 'error');
        } else if (!this.validaTipoArchivoAnexo()) {
          swal.fire('Tipo de archivo no válido', 'Por favor seleccione un archivo con extensión .pdf', 'error');
        }
      } else if (this.formulario.valid) {
        let html, foot;
        if (this.formulario.get('dias')!.value > 2 && this.causasAusentismos[indexCausa].causa.codigo === "4" ) {
          html = 'Por favor hacer llegar al área de talento humano o área encargada los documentos físicos originales de la incapacidad e historia clínica debido a que su incapacidad supera los dos días de ausentismo.<br>'
          foot = '¿Esta seguro(a) de que desea enviar la novedad?';
        } else if (this.formulario.get('dias')!.value > 1 && this.causasAusentismos[indexCausa].causa.codigo === "6" ) {
          html = 'Por favor hacer llegar al área de talento humano o área encargada los documentos físicos originales de la incapacidad e historia clínica debido a que su incapacidad supera un día de ausentismo.<br>'
          foot = '¿Esta seguro(a) de que desea enviar la novedad?';
        } else if (this.causasAusentismos[indexCausa].causa.codigo === "5" ) {
          html = 'Por favor hacer llegar al área de talento humano o área encargada los documentos físicos originales de la incapacidad e historia clínica.<br>'
          foot = '¿Esta seguro(a) de que desea enviar la novedad?';
        } else {
          html = '¿Esta seguro(a) de que desea enviar la novedad?'
          foot = '';
        }
        swal
          .fire({
            title: "Aviso",
            html: html,
            icon: "warning",
            footer: foot,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Aceptar",
            showCancelButton: true,
          })
          .then((result) => {
            if (result.value) {
              let incluyeAnexo = 'N';
              if (this.formulario.get('anexo')!.value != null && this.formulario.get('anexo')!.value != "") {
                incluyeAnexo = 'S';
              }
              console.log('causasAusentismos', this.causasAusentismos);
              let secuenciaClase = this.causasAusentismos[indexCausa].causa.clase.secuencia;
              let secuenciaTipo = this.causasAusentismos[indexCausa].causa.clase.tipo.secuencia;
              let secuenciaCausa = this.causasAusentismos[indexCausa].causa.secuencia;
              let codCausa = this.causasAusentismos[indexCausa].causa.codigo;
              let secuenciaProrroga: any = null;
              if (this.prorrogaSeleccionada && this.prorrogaSeleccionada != null
                //&& this.prorrogaSeleccionada != [] 
                && this.formulario.get('prorroga')) {
                secuenciaProrroga = this.prorrogaSeleccionada[0];
              }
              /* si la fecha de solicitud coincide con alguna novedad anterior */
              if (this.estadoNovEmple == 'KSA' || this.estadoNovEmple == 'SA' || this.estadoNovEmple == 'SV') {
                swal.fire({
                  title: this.msjNovEmpleTitle,
                  text: this.msjNovEmpleDetalle,
                  icon: 'warning',
                }).then(() => {
                  this.router.navigate(['/ausentismos']);
                });
              } else {
                swal.fire({
                  title: "Enviando la solicitud al sistema, por favor espere...",
                  willOpen: () => {
                    swal.showLoading();
                    this.ausentismosService.crearNovedadAusentismo(
                      this.usuarioService.tokenJWT,
                      this.usuarioService.usuario,
                      this.usuarioService.empresa,
                      'ENVIADO',
                      this.formatoddmmyyyy(this.formulario.get('fechainicio')!.value),
                      this.formulario.get('fechafin')!.value,
                      this.formulario.get('dias')!.value,
                      secuenciaCausa, this.secCodDiagSelec,
                      secuenciaClase,
                      secuenciaTipo, secuenciaProrroga,
                      this.formulario.get('observaciones')!.value,
                      incluyeAnexo,
                      this.usuarioService.cadenaConexion,
                      this.usuarioService.urlKioscoDomain,
                      this.usuarioService.grupoEmpresarial,
                      codCausa)
                      .subscribe(
                        (data: any) => {
                          if (data["NovedadCreada"]) {
                            swal
                              .fire({
                                icon: "info",
                                title:
                                  "Validando novedad en el sistema...",
                                showConfirmButton: false,
                                timer: 1500
                              })
                              .then((res) => {
                                //this.router.navigate(["/ausentismos"]);
                                // Si se registro correctamente la novedad, subir el anexo:
                                if (incluyeAnexo == 'S') {
                                  //console.log('Novedad reportada incluye anexo');
                                  this.subirAnexo(data["anexo"], data["solicitud"]);
                                } else {
                                  //console.log('Novedad reportada NO incluye anexo');
                                  //console.log('solicitud creada: ' + data["solicitud"])
                                  this.enviarCorreoNovedad(data["solicitud"]);
                                }

                              });
                          } else {
                            swal
                              .fire({
                                icon: "error",
                                title: data["mensaje"],
                                showConfirmButton: true,
                              })
                              .then((res) => {
                                this.router.navigate(["/ausentismos"]);
                              });
                          }
                        }
                      );
                  },
                  allowOutsideClick: () => !swal.isLoading(),
                });
              }
            }
          });
      }
    } else {
      swal.fire({
        title: "¡Por favor valide el formulario!",
        text:
          "Por favor valide que todos los campos obligatorios del formulario estén diligenciados.",
        icon: "error",
      });
    }
  }

  subirAnexo(nombreAnexo: string, secKioSoliciAusentismo: string) {
    const formData = new FormData();
    formData.append('fichero', this.formulario.get('anexo')!.value, nombreAnexo + '.pdf');
    let cargueArchivo: boolean = false;
    this.http
      .post<any>(
        `${environment.urlKioskoReportes}ausentismos/cargarAnexoAusentismo?seudonimo=${this.usuarioService.usuario}&solicitud=${secKioSoliciAusentismo}&nit=${this.usuarioService.empresa}&cadena=${this.usuarioService.cadenaConexion}`, formData
      )
      .subscribe(
        (data: boolean) => {
          console.log(data);
          cargueArchivo = data;
          if (data) {
            console.log('cargueArchivo ', cargueArchivo);
            swal
              .fire({
                icon: 'success',
                title: 'Se ha subido el documento anexo exitosamente.',
                showConfirmButton: false,
                timer: 1500
              })
              .then((result) => {
                this.enviarCorreoNovedad(secKioSoliciAusentismo);
              });
          } else {
            swal
              .fire({
                icon: 'error',
                title: 'Se ha presentado un error',
                text:
                  'No se ha podido cargar el archivo, por favor inténtalo de nuevo más tarde.',
                showConfirmButton: true,
              })
              .then((result) => {
              });
          }

        }
      );
  }

  enviarCorreoNovedad(secSoliciAusentismo: string) {
    swal.fire({
      title: "Enviando la solicitud al sistema, por favor espere...",
      willOpen: () => {
        swal.showLoading();
        this.ausentismosService.enviarCorreoNuevaNovedad(
          this.usuarioService.usuario,
          this.usuarioService.empresa,
          secSoliciAusentismo,
          this.formulario.get('observaciones')!.value,
          "Asunto prueba",
          this.usuarioService.urlKioscoDomain,
          this.usuarioService.grupoEmpresarial,
          this.usuarioService.cadenaConexion
        )
          .subscribe(
            data => {
              if (data) {
                swal.fire({
                  icon: 'success',
                  title: 'Su novedad de ausentismo ha sido reportada exitosamente',
                  showConfirmButton: true
                }).then((result) => {
                  this.router.navigateByUrl('/ausentismos');
                });
              } else {
                swal.fire({
                  icon: 'error',
                  title: 'Ha ocurrido un error al reportar su novedad de ausentismo',
                  text: 'Por favor intentelo de nuevo más tarde, si el problema persiste comuniquese con el área de nómina y/o Talento humano de su empresa.',
                  showConfirmButton: true
                }).then((result) => {
                  this.router.navigateByUrl('/ausentismos');
                });
              }
            }
          )
      },
      allowOutsideClick: () => !swal.isLoading(),
    });
  }

  formatoddmmyyyy(fecha: any) {
    var momentVariable = moment(fecha).format('DD/MM/YYYY');
    return momentVariable;
  }

  formatommddyyyy(fecha: any) {
    var momentVariable = moment(fecha, 'DD/MM/YYYY');
    var stringvalue = momentVariable.format('YYYY-MM-DD');
    return stringvalue;
  }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formulario.get('anexo')!.setValue(file);
      if (this.validaTipoArchivoAnexo()) {
        this.msjValidArchivoAnexo = '';
        this.nomArchivo = this.formulario.get('anexo')!.value.name;
        if (!this.validaSizeAnexo()) {
          this.msjValidArchivoAnexo = 'El tamaño del archivo es demasiado grande. Seleccione un archivo de máximo 5MB.'
          swal.fire('Tamaño de archivo demasiado grande', 'Por favor seleccione un archivo de máximo 5MB', 'error');
        }
      } else {
        this.msjValidArchivoAnexo = 'El tipo de archivo seleccionado no es válido. Seleccione un archivo con extensión .pdf';
        swal.fire('Tipo de archivo no válido', 'Por favor seleccione un archivo con extensión .pdf', 'error');
      }

    } else {
      swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error.',
        showConfirmButton: true
      });
    }
  }

  // Método que retorna true si el tamaño del archivo no supera los 5MB
  validaSizeAnexo() {
    let valid = false;
    let sizeArchivo = (this.formulario.get('anexo')!.value.size / 1048576);
    let sizeArchivo2 = parseFloat(parseFloat(sizeArchivo.toString()).toFixed(2));
    if (sizeArchivo2 <= 5) {
      valid = true;
    }
    return valid;
  }

  // Método que retorna true si el archivo anexo corresponde a un pdf
  validaTipoArchivoAnexo() {
    let valid = false;
    if (this.formulario.get('anexo')!.value.type == 'application/pdf') {
      valid = true;
    }
    return valid;
  }

  // Método que quitar  el archivo seleccionado del campo de anexo,
  quitarArchivoSeleccionado() {
    this.msjValidArchivoAnexo = '';
    this.formulario.get('anexo')!.setValue('');
    this.nomArchivo = null;
  }
  // 211019 dar formato a fecha 
  asigFecha() {
    let datetemp = this.formatoddmmyyyy(this.formulario.get('fechainicio')!.value);
    this.formulario.get("fechainiciodt")!.setValue(datetemp);
    document.getElementById("fechainiciodt")!.hidden = false;
    document.getElementById("fechainicio")!.hidden = true;
  }

  backDt() {
    document.getElementById("fechainiciodt")!.hidden = true;
    document.getElementById("fechainicio")!.hidden = false;
  }

  backText() {
    document.getElementById("fechainiciodt")!.hidden = false;
    document.getElementById("fechainicio")!.hidden = true;
  }
  onPageChange(pagina: number) {
    //this.p1 = pagina;
    this.configSecond.currentPage = pagina;
  }

  get dataFilt(): string {
    return this._dataFilt;
  }

  set dataFilt(val: string) {
    this._dataFilt = val;
    this.codigosAusentismos = this.filter(val, 1);
    //this.ausentismosService.codigosAusentismos = this.filter(val, 1);
  }

  filter(v: string, t: number) {
    if (v === '') {
      switch (t) {
        case 1: {
          this.getOpcionesDiagnosticos();
          break;
        }
        default: {
          break;
        }
      }
    }
    switch (t) {
      case 1: {
        this.codigosAusentismosFilt = this.ausentismosService.codigosAusentismos;
        break;
      }
      default: {
        this.codigosAusentismosFilt = null;
        break;
      }
    }
    return this.codigosAusentismosFilt.filter((v1: any) => (v1[1].toString().toLowerCase().indexOf(v.toLowerCase()) !== -1
    ||  v1[2].toString().toLowerCase().indexOf(v.toLowerCase()) !== -1)
    );
    
  }
}
